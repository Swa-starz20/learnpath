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

import java.util.UUID;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the assessment controller endpoints.
 * Verifies active templates, session starting, answering, submitting, and result retrieval.
 */
@SpringBootTest
@AutoConfigureMockMvc
@Testcontainers
@ActiveProfiles("test")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class AssessmentControllerIntegrationTest {

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
    private AssessmentResultRepository resultRepository;

    private static String studentToken;
    private static String otherStudentToken;

    private static UUID templateId;
    private static UUID questionId;
    private static UUID optionId;

    private static UUID sessionId;

    @Test
    @Order(1)
    @DisplayName("Prepare users and seed assessment data")
    void prepareData() throws Exception {
        // Register main student
        RegisterRequest registerRequest = new RegisterRequest(
                "student@learnpath.dev", "Secure1234", "Student", "One");
        MvcResult registerResult = mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isCreated())
                .andReturn();
        studentToken = objectMapper.readTree(registerResult.getResponse().getContentAsString())
                .path("data").path("accessToken").asText();

        // Register another student to test ownership access/forbidden errors
        RegisterRequest otherRegisterRequest = new RegisterRequest(
                "other@learnpath.dev", "Secure1234", "Student", "Two");
        MvcResult otherRegisterResult = mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(otherRegisterRequest)))
                .andExpect(status().isCreated())
                .andReturn();
        otherStudentToken = objectMapper.readTree(otherRegisterResult.getResponse().getContentAsString())
                .path("data").path("accessToken").asText();

        // Fetch domain COMP_ENG seeded in db V3 migration
        Domain domain = domainRepository.findByCode("COMP_ENG")
                .orElseThrow(() -> new IllegalStateException("COMP_ENG domain not found"));

        // Create skill and template
        Skill skill = new Skill(domain, "Algorithms", "Core Algorithms", "DATA_STRUCTURES");
        skill = skillRepository.save(skill);

        AssessmentTemplate template = new AssessmentTemplate(
                "COMP_ENG_ALGO_1", "Algorithms Diagnostic", "Basic algorithms and data structures quiz",
                "QUIZ", domain, 30, 1);
        template = templateRepository.save(template);
        templateId = template.getId();

        // Create question
        AssessmentQuestion question = new AssessmentQuestion(
                template, "What is the time complexity of binary search?", "MULTIPLE_CHOICE", "MEDIUM", skill, 1);
        question = questionRepository.save(question);
        questionId = question.getId();

        // Create option
        AssessmentOption option = new AssessmentOption(
                question, "O(log n)", "O(log n)", 1, true);
        option = optionRepository.save(option);
        optionId = option.getId();
    }

    @Test
    @Order(2)
    @DisplayName("GET /templates — returns active templates")
    void listTemplates_success() throws Exception {
        mockMvc.perform(get("/api/v1/assessments/templates"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$.data[0].code").value("COMP_ENG_ALGO_1"));
    }

    @Test
    @Order(3)
    @DisplayName("GET /templates/{id} — returns template by ID")
    void getTemplate_success() throws Exception {
        mockMvc.perform(get("/api/v1/assessments/templates/" + templateId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value(templateId.toString()));
    }

    @Test
    @Order(4)
    @DisplayName("POST /sessions/start — starts session successfully")
    void startSession_success() throws Exception {
        StartSessionRequest request = new StartSessionRequest(templateId);

        MvcResult result = mockMvc.perform(post("/api/v1/assessments/sessions/start")
                        .header("Authorization", "Bearer " + studentToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.templateId").value(templateId.toString()))
                .andExpect(jsonPath("$.data.status").value("IN_PROGRESS"))
                .andReturn();

        sessionId = UUID.fromString(objectMapper.readTree(result.getResponse().getContentAsString())
                .path("data").path("id").asText());
    }

    @Test
    @Order(5)
    @DisplayName("POST /sessions/start — fails if active session already exists")
    void startSession_duplicateFails() throws Exception {
        StartSessionRequest request = new StartSessionRequest(templateId);

        mockMvc.perform(post("/api/v1/assessments/sessions/start")
                        .header("Authorization", "Bearer " + studentToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @Order(6)
    @DisplayName("GET /sessions/{id} — returns session for owner")
    void getSession_success() throws Exception {
        mockMvc.perform(get("/api/v1/assessments/sessions/" + sessionId)
                        .header("Authorization", "Bearer " + studentToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value(sessionId.toString()));
    }

    @Test
    @Order(7)
    @DisplayName("GET /sessions/{id} — forbidden for another student")
    void getSession_forbidden() throws Exception {
        mockMvc.perform(get("/api/v1/assessments/sessions/" + sessionId)
                        .header("Authorization", "Bearer " + otherStudentToken))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @Order(8)
    @DisplayName("POST /sessions/{id}/answer — submits answer successfully")
    void submitAnswer_success() throws Exception {
        SubmitAnswerRequest request = new SubmitAnswerRequest(questionId, optionId, "O(log n)");

        mockMvc.perform(post("/api/v1/assessments/sessions/" + sessionId + "/answer")
                        .header("Authorization", "Bearer " + studentToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.questionId").value(questionId.toString()))
                .andExpect(jsonPath("$.data.selectedOptionId").value(optionId.toString()));
    }

    @Test
    @Order(9)
    @DisplayName("POST /sessions/{id}/submit — finalizes session and creates result")
    void submitSession_success() throws Exception {
        SubmitSessionRequest request = new SubmitSessionRequest(120);

        mockMvc.perform(post("/api/v1/assessments/sessions/" + sessionId + "/submit")
                        .header("Authorization", "Bearer " + studentToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.sessionId").value(sessionId.toString()))
                .andExpect(jsonPath("$.data.scorePercentage").value(100.0));
    }

    @Test
    @Order(10)
    @DisplayName("POST /sessions/{id}/answer — fails if session is not in progress")
    void submitAnswer_sessionNotInProgressFails() throws Exception {
        SubmitAnswerRequest request = new SubmitAnswerRequest(questionId, optionId, "O(log n)");

        mockMvc.perform(post("/api/v1/assessments/sessions/" + sessionId + "/answer")
                        .header("Authorization", "Bearer " + studentToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }
}
