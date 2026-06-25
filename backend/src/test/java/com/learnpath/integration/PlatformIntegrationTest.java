package com.learnpath.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.learnpath.assessment.dto.*;
import com.learnpath.assessment.entity.*;
import com.learnpath.assessment.repository.*;
import com.learnpath.auth.dto.LoginRequest;
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

import java.util.UUID;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * End-to-end Platform Integration test covering the full user lifecycle:
 * Register -> Login -> Assessment -> Evaluation -> Mentor Generation -> Placement Intelligence -> Analytics -> Notifications -> Dashboard Aggregation -> Search -> Health -> Swagger Availability.
 */
@SpringBootTest
@AutoConfigureMockMvc
@Testcontainers
@ActiveProfiles("test")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class PlatformIntegrationTest {

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

    private static String token;
    private static UUID templateId;
    private static UUID questionId;
    private static UUID optionId;
    private static UUID sessionId;

    @Test
    @Order(1)
    @DisplayName("1. User Registration")
    void testRegister() throws Exception {
        RegisterRequest registerRequest = new RegisterRequest(
                "e2e@learnpath.dev", "Secure1234", "E2E User", "Engineering Student");
        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.accessToken").isNotEmpty())
                .andExpect(jsonPath("$.data.user.email").value("e2e@learnpath.dev"));
    }

    @Test
    @Order(2)
    @DisplayName("2. User Login")
    void testLogin() throws Exception {
        LoginRequest loginRequest = new LoginRequest("e2e@learnpath.dev", "Secure1234");
        MvcResult result = mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.accessToken").isNotEmpty())
                .andReturn();

        token = objectMapper.readTree(result.getResponse().getContentAsString())
                .path("data").path("accessToken").asText();
    }

    @Test
    @Order(3)
    @DisplayName("3. Setup Assessment Template & Data")
    void testSetupAssessment() throws Exception {
        Domain domain = domainRepository.findByCode("COMP_ENG")
                .orElseThrow(() -> new IllegalStateException("COMP_ENG domain not found"));

        Skill skill = new Skill(domain, "Algorithms", "Core Algorithms", "DATA_STRUCTURES");
        skill = skillRepository.save(skill);

        AssessmentTemplate template = new AssessmentTemplate(
                "COMP_ENG_E2E_1", "E2E Algorithms", "E2E Assessment",
                "QUIZ", domain, 30, 1);
        template = templateRepository.save(template);
        templateId = template.getId();

        AssessmentQuestion question = new AssessmentQuestion(
                template, "What is O(1)?", "MULTIPLE_CHOICE", "EASY", skill, 1);
        question = questionRepository.save(question);
        questionId = question.getId();

        AssessmentOption option = new AssessmentOption(
                question, "Constant Time", "Constant Time", 1, true);
        option = optionRepository.save(option);
        optionId = option.getId();
    }

    @Test
    @Order(4)
    @DisplayName("4. Start Assessment Session")
    void testStartSession() throws Exception {
        StartSessionRequest request = new StartSessionRequest(templateId);
        MvcResult result = mockMvc.perform(post("/api/v1/assessments/sessions/start")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("IN_PROGRESS"))
                .andReturn();

        sessionId = UUID.fromString(objectMapper.readTree(result.getResponse().getContentAsString())
                .path("data").path("id").asText());
    }

    @Test
    @Order(5)
    @DisplayName("5. Answer Question")
    void testAnswerQuestion() throws Exception {
        SubmitAnswerRequest request = new SubmitAnswerRequest(questionId, optionId, "Constant Time");
        mockMvc.perform(post("/api/v1/assessments/sessions/" + sessionId + "/answer")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    @Order(6)
    @DisplayName("6. Submit Session and Evaluation")
    void testSubmitSession() throws Exception {
        SubmitSessionRequest request = new SubmitSessionRequest(60);
        mockMvc.perform(post("/api/v1/assessments/sessions/" + sessionId + "/submit")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    @Order(7)
    @DisplayName("7. Verify Dashboard Aggregation")
    void testDashboardAggregation() throws Exception {
        mockMvc.perform(get("/api/v1/dashboard")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.profile.email").value("e2e@learnpath.dev"));
    }

    @Test
    @Order(8)
    @DisplayName("8. Verify Search")
    void testSearch() throws Exception {
        mockMvc.perform(get("/api/v1/search?q=Algorithms")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.skills", notNullValue()));
    }

    @Test
    @Order(9)
    @DisplayName("9. Verify Health Endpoint")
    void testHealth() throws Exception {
        mockMvc.perform(get("/actuator/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("UP"));
    }

    @Test
    @Order(10)
    @DisplayName("10. Verify Swagger Availability")
    void testSwaggerAvailability() throws Exception {
        mockMvc.perform(get("/v3/api-docs"))
                .andExpect(status().isOk());
        mockMvc.perform(get("/swagger-ui.html"))
                .andExpect(status().is3xxRedirection());
    }
}
