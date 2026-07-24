package com.learnpath.assessment;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.learnpath.assessment.dto.*;
import com.learnpath.assessment.entity.*;
import com.learnpath.assessment.repository.*;
import com.learnpath.auth.dto.RegisterRequest;
import com.learnpath.domain.entity.Domain;
import com.learnpath.domain.repository.DomainRepository;
import com.learnpath.skill.entity.Skill;
import com.learnpath.skill.repository.SkillRepository;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.math.BigDecimal;
import java.util.UUID;

import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Testcontainers
@ActiveProfiles("test")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class AssessmentMetricsIntegrationTest {

    @Container
    static PostgreSQLContainer<?> postgres =
            new PostgreSQLContainer<>("postgres:16-alpine")
                    .withDatabaseName("learnpath_test")
                    .withUsername("test_user")
                    .withPassword("test_password");

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
        registry.add("jwt.secret", () -> "testSecretKeyThatIsAtLeast32CharactersLong!");
        registry.add("jwt.access-token-ttl-minutes", () -> "60");
    }

    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private DomainRepository domainRepository;
    @Autowired
    private SkillRepository skillRepository;
    @Autowired
    private AssessmentTemplateRepository templateRepository;
    @Autowired
    private AssessmentQuestionRepository questionRepository;
    @Autowired
    private AssessmentOptionRepository optionRepository;
    @Autowired
    private AssessmentSessionRepository sessionRepository;
    @Autowired
    private AssessmentMetricRepository metricRepository;

    private static String token;
    private static UUID templateId;
    private static UUID questionId;
    private static UUID optionId;
    private static UUID sessionId;

    @Test
    @Order(1)
    @DisplayName("Seed database and configure test context")
    void seedData() throws Exception {
        RegisterRequest registerRequest = new RegisterRequest(
                "metrics@learnpath.dev", "Secure1234", "Metrics", "User");
        MvcResult registerResult = mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isCreated())
                .andReturn();
        token = objectMapper.readTree(registerResult.getResponse().getContentAsString())
                .path("data").path("accessToken").asText();

        Domain domain = domainRepository.findByCode("COMP_ENG")
                .orElseThrow(() -> new IllegalStateException("COMP_ENG domain not found"));

        Skill skill = new Skill(domain, "Core Tech", "Desc", "TECHNICAL_SKILLS");
        skill = skillRepository.save(skill);

        AssessmentTemplate template = new AssessmentTemplate(
                "COMP_ENG_METRICS", "Metrics Diagnostic", "Desc", "QUIZ", domain, 20, 1);
        template = templateRepository.save(template);
        templateId = template.getId();

        AssessmentQuestion question = new AssessmentQuestion(
                template, "Question?", "MULTIPLE_CHOICE", "MEDIUM", skill, 1);
        question = questionRepository.save(question);
        questionId = question.getId();

        AssessmentOption option = new AssessmentOption(question, "Yes", "Yes", 1, true);
        option = optionRepository.save(option);
        optionId = option.getId();
    }

    @Test
    @Order(2)
    @DisplayName("Submit session and verify score metrics are correctly persisted")
    void evaluateAndVerifyMetrics() throws Exception {
        // Start session
        StartSessionRequest startReq = new StartSessionRequest(templateId);
        MvcResult startRes = mockMvc.perform(post("/api/v1/assessments/sessions/start")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(startReq)))
                .andExpect(status().isCreated())
                .andReturn();
        sessionId = UUID.fromString(objectMapper.readTree(startRes.getResponse().getContentAsString())
                .path("data").path("id").asText());

        // Submit answer (correct option)
        SubmitAnswerRequest answerReq = new SubmitAnswerRequest(questionId, optionId, "Yes");
        mockMvc.perform(post("/api/v1/assessments/sessions/" + sessionId + "/answer")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(answerReq)))
                .andExpect(status().isOk());

        // Finalize/Submit session
        SubmitSessionRequest submitReq = new SubmitSessionRequest(150);
        MvcResult submitRes = mockMvc.perform(post("/api/v1/assessments/sessions/" + sessionId + "/submit")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(submitReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.scorePercentage").value(100.00))
                .andReturn();

        UUID resultId = UUID.fromString(objectMapper.readTree(submitRes.getResponse().getContentAsString())
                .path("data").path("id").asText());

        // Verify AssessmentMetric row is persisted in database
        AssessmentMetric metric = metricRepository.findByAssessmentResultId(resultId).orElse(null);
        assertNotNull(metric);
        assertEquals(new BigDecimal("100.00"), metric.getOverallScore());
        assertEquals(new BigDecimal("100.00"), metric.getTechnicalScore());
        assertEquals(new BigDecimal("100.00"), metric.getDomainReadinessScore());
        assertNull(metric.getAptitudeScore());
        assertNull(metric.getBehavioralScore());
        assertNull(metric.getCommunicationScore());
    }

    @Test
    @Order(3)
    @DisplayName("Evaluate session again — fails with 400 Bad Request (duplicate prevention)")
    void duplicateEvaluationFails() throws Exception {
        SubmitSessionRequest submitReq = new SubmitSessionRequest(150);
        mockMvc.perform(post("/api/v1/assessments/sessions/" + sessionId + "/submit")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(submitReq)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }
}
