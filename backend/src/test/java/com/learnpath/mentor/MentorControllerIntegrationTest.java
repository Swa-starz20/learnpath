package com.learnpath.mentor;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.learnpath.auth.dto.RegisterRequest;
import com.learnpath.domain.entity.Domain;
import com.learnpath.domain.repository.DomainRepository;
import com.learnpath.mentor.dto.UpdateMentorProfileRequest;
import com.learnpath.mentor.entity.MentorInsight;
import com.learnpath.mentor.entity.MentorRecommendation;
import com.learnpath.mentor.repository.MentorInsightRepository;
import com.learnpath.mentor.repository.MentorRecommendationRepository;
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
 * Integration tests for the AI Mentor Foundation endpoints.
 */
@SpringBootTest
@AutoConfigureMockMvc
@Testcontainers
@ActiveProfiles("test")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class MentorControllerIntegrationTest {

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
    private MentorInsightRepository insightRepository;

    @Autowired
    private MentorRecommendationRepository recommendationRepository;

    private static String token;
    private static UUID userId;
    private static Long domainId;

    @Test
    @Order(1)
    @DisplayName("Setup test user and fetch domain")
    void setup() throws Exception {
        RegisterRequest registerRequest = new RegisterRequest(
                "mentor.test@learnpath.dev", "Secure1234", "Mentor", "Tester");
        MvcResult registerResult = mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isCreated())
                .andReturn();

        token = objectMapper.readTree(registerResult.getResponse().getContentAsString())
                .path("data").path("accessToken").asText();

        String userIdStr = objectMapper.readTree(registerResult.getResponse().getContentAsString())
                .path("data").path("user").path("id").asText();
        userId = UUID.fromString(userIdStr);

        Domain domain = domainRepository.findByCode("COMP_ENG")
                .orElseThrow(() -> new IllegalStateException("COMP_ENG domain not found"));
        domainId = domain.getId();
    }

    @Test
    @Order(2)
    @DisplayName("POST /profile — unauthenticated access returns 401")
    void createProfile_unauthenticated() throws Exception {
        UpdateMentorProfileRequest request = new UpdateMentorProfileRequest(domainId, "Beginner", "Software Engineer");
        mockMvc.perform(post("/api/v1/mentor/profile")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @Order(3)
    @DisplayName("GET /profile — unauthenticated access returns 401")
    void getProfile_unauthenticated() throws Exception {
        mockMvc.perform(get("/api/v1/mentor/profile"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @Order(4)
    @DisplayName("POST /profile — creates mentor profile successfully")
    void createProfile_success() throws Exception {
        UpdateMentorProfileRequest request = new UpdateMentorProfileRequest(domainId, "Beginner", "Software Engineer");
        mockMvc.perform(post("/api/v1/mentor/profile")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.userId", is(userId.toString())))
                .andExpect(jsonPath("$.data.primaryDomainId", is(domainId.intValue())))
                .andExpect(jsonPath("$.data.currentLevel", is("Beginner")))
                .andExpect(jsonPath("$.data.targetRole", is("Software Engineer")));
    }

    @Test
    @Order(5)
    @DisplayName("POST /profile — returns 409 when profile already exists")
    void createProfile_duplicate() throws Exception {
        UpdateMentorProfileRequest request = new UpdateMentorProfileRequest(domainId, "Beginner", "Software Engineer");
        mockMvc.perform(post("/api/v1/mentor/profile")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.success", is(false)))
                .andExpect(jsonPath("$.message", containsString("Mentor profile already exists")));
    }

    @Test
    @Order(6)
    @DisplayName("GET /profile — retrieves mentor profile successfully")
    void getProfile_success() throws Exception {
        mockMvc.perform(get("/api/v1/mentor/profile")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.userId", is(userId.toString())))
                .andExpect(jsonPath("$.data.primaryDomainId", is(domainId.intValue())))
                .andExpect(jsonPath("$.data.currentLevel", is("Beginner")));
    }

    @Test
    @Order(7)
    @DisplayName("PUT /profile — updates mentor profile successfully")
    void updateProfile_success() throws Exception {
        UpdateMentorProfileRequest request = new UpdateMentorProfileRequest(domainId, "Intermediate", "Senior Tech Lead");
        mockMvc.perform(put("/api/v1/mentor/profile")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.currentLevel", is("Intermediate")))
                .andExpect(jsonPath("$.data.targetRole", is("Senior Tech Lead")));
    }

    @Test
    @Order(8)
    @DisplayName("GET /insights — lists mentor insights successfully")
    void listInsights_success() throws Exception {
        // Save mock insights
        MentorInsight insight1 = new MentorInsight(userId, "PACING", "Slow down", "Take your time", 2);
        MentorInsight insight2 = new MentorInsight(userId, "CRITICAL_GAP", "Algorithms weak", "Study sorting algorithms", 3);
        insightRepository.save(insight1);
        insightRepository.save(insight2);

        mockMvc.perform(get("/api/v1/mentor/insights")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data", hasSize(2)))
                .andExpect(jsonPath("$.data[0].insightType", anyOf(is("PACING"), is("CRITICAL_GAP"))));
    }

    @Test
    @Order(9)
    @DisplayName("GET /recommendations — lists recommendations successfully")
    void listRecommendations_success() throws Exception {
        // Save mock recommendations
        MentorRecommendation rec1 = new MentorRecommendation(userId, "COURSE", "Learn React", "Start front-end basics", "/courses/react");
        MentorRecommendation rec2 = new MentorRecommendation(userId, "ASSESSMENT", "Take Math Quiz", "Strengthen logic skills", "/assessments/math");
        recommendationRepository.save(rec1);
        recommendationRepository.save(rec2);

        mockMvc.perform(get("/api/v1/mentor/recommendations")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data", hasSize(2)))
                .andExpect(jsonPath("$.data[0].recommendationType", anyOf(is("COURSE"), is("ASSESSMENT"))));
    }
}
