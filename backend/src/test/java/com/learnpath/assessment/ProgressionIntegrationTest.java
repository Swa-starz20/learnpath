package com.learnpath.assessment;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.learnpath.assessment.dto.*;
import com.learnpath.assessment.entity.*;
import com.learnpath.assessment.repository.*;
import com.learnpath.auth.dto.RegisterRequest;
import com.learnpath.domain.entity.Domain;
import com.learnpath.domain.repository.DomainRepository;
import com.learnpath.progression.entity.UserProgression;
import com.learnpath.progression.repository.UserProgressionRepository;
import com.learnpath.skill.entity.Skill;
import com.learnpath.skill.entity.UserSkill;
import com.learnpath.skill.repository.SkillRepository;
import com.learnpath.skill.repository.UserSkillRepository;
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

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Testcontainers
@ActiveProfiles("test")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class ProgressionIntegrationTest {

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
    private UserSkillRepository userSkillRepository;
    @Autowired
    private UserProgressionRepository progressionRepository;

    private static String token;
    private static UUID userId;
    private static UUID templateId;
    private static UUID questionId;
    private static UUID optionId;
    private static Long skillId;

    @Test
    @Order(1)
    @DisplayName("Seed database and configure test context")
    void seedData() throws Exception {
        RegisterRequest registerRequest = new RegisterRequest(
                "progression@learnpath.dev", "Secure1234", "Progression", "User");
        MvcResult registerResult = mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isCreated())
                .andReturn();
        String responseString = registerResult.getResponse().getContentAsString();
        token = objectMapper.readTree(responseString).path("data").path("accessToken").asText();
        userId = UUID.fromString(objectMapper.readTree(responseString).path("data").path("user").path("id").asText());

        Domain domain = domainRepository.findByCode("COMP_ENG")
                .orElseThrow(() -> new IllegalStateException("COMP_ENG domain not found"));

        Skill skill = new Skill(domain, "Database Indexing", "Desc", "TECHNICAL");
        skill = skillRepository.save(skill);
        skillId = skill.getId();

        AssessmentTemplate template = new AssessmentTemplate(
                "COMP_ENG_DB_1", "Database Quiz", "Desc", "QUIZ", domain, 15, 1);
        template = templateRepository.save(template);
        templateId = template.getId();

        AssessmentQuestion question = new AssessmentQuestion(
                template, "Question?", "MULTIPLE_CHOICE", "MEDIUM", skill, 1);
        question = questionRepository.save(question);
        questionId = question.getId();

        AssessmentOption option = new AssessmentOption(question, "CorrectAnswer", "CorrectAnswer", 1, true);
        option = optionRepository.save(option);
        optionId = option.getId();
    }

    @Test
    @Order(2)
    @DisplayName("Complete assessment and verify asynchronous event execution for skill and progression updates")
    void completeAssessmentAndVerifyUpdates() throws Exception {
        // Start session
        StartSessionRequest startReq = new StartSessionRequest(templateId);
        MvcResult startRes = mockMvc.perform(post("/api/v1/assessments/sessions/start")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(startReq)))
                .andExpect(status().isCreated())
                .andReturn();
        UUID sessionId = UUID.fromString(objectMapper.readTree(startRes.getResponse().getContentAsString())
                .path("data").path("id").asText());

        // Submit answer (correct option)
        SubmitAnswerRequest answerReq = new SubmitAnswerRequest(questionId, optionId, "CorrectAnswer");
        mockMvc.perform(post("/api/v1/assessments/sessions/" + sessionId + "/answer")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(answerReq)))
                .andExpect(status().isOk());

        // Submit session
        SubmitSessionRequest submitReq = new SubmitSessionRequest(100);
        mockMvc.perform(post("/api/v1/assessments/sessions/" + sessionId + "/submit")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(submitReq)))
                .andExpect(status().isCreated());

        // 1. Verify UserSkill was created with confidence score 60.00
        UserSkill us = userSkillRepository.findByUserIdAndSkillId(userId, skillId).orElse(null);
        assertNotNull(us);
        assertEquals(new BigDecimal("60.00"), us.getConfidenceScore());
        assertEquals("INTERMEDIATE", us.getMasteryLevel());

        // 2. Verify UserProgression was updated: XP added (200 + 3 * 100 = 500) and Mastery set to 60.00
        UserProgression progression = progressionRepository.findByUserId(userId).orElse(null);
        assertNotNull(progression);
        assertEquals(500, progression.getTotalXp());
        assertEquals(new BigDecimal("60.00"), progression.getMasteryScore());
    }
}
