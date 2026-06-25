package com.learnpath.analytics;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.learnpath.analytics.service.AnalyticsService;
import com.learnpath.auth.dto.RegisterRequest;
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

import java.util.Map;
import java.util.UUID;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the Analytics endpoints.
 */
@SpringBootTest
@AutoConfigureMockMvc
@Testcontainers
@ActiveProfiles("test")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class AnalyticsControllerIntegrationTest {

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
    private AnalyticsService analyticsService;

    private static String token;
    private static UUID userId;

    @Test
    @Order(1)
    @DisplayName("Setup test user")
    void setup() throws Exception {
        RegisterRequest registerRequest = new RegisterRequest(
                "analytics.test@learnpath.dev", "Secure1234", "Analytics", "Tester");
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
    }

    @Test
    @Order(2)
    @DisplayName("GET /summary — unauthenticated access returns 401")
    void getSummary_unauthenticated() throws Exception {
        mockMvc.perform(get("/api/v1/analytics/summary"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @Order(3)
    @DisplayName("GET /summary — retrieves/bootstraps latest summary snapshot successfully")
    void getSummary_success() throws Exception {
        mockMvc.perform(get("/api/v1/analytics/summary")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.userId", is(userId.toString())))
                .andExpect(jsonPath("$.data.totalXp", is(0)))
                .andExpect(jsonPath("$.data.masteryScore", is(0)))
                .andExpect(jsonPath("$.data.overallProgress", is(0.0)));
    }

    @Test
    @Order(4)
    @DisplayName("POST /snapshot — calculates and retrieves snapshot successfully")
    void createSnapshot_success() throws Exception {
        mockMvc.perform(post("/api/v1/analytics/snapshot")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.userId", is(userId.toString())))
                .andExpect(jsonPath("$.data.totalXp", is(0)));
    }

    @Test
    @Order(5)
    @DisplayName("GET /streak — retrieves default streak successfully")
    void getStreak_success() throws Exception {
        mockMvc.perform(get("/api/v1/analytics/streak")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.userId", is(userId.toString())))
                .andExpect(jsonPath("$.data.currentStreak", is(0)));
    }

    @Test
    @Order(6)
    @DisplayName("Append activity log and retrieve history")
    void activityLog_success() throws Exception {
        // Append activity log using service to simulate user action
        analyticsService.appendActivityLog(userId, "LOGIN", "session-123", Map.of("device", "web"));

        mockMvc.perform(get("/api/v1/analytics/activity")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$.data[0].activityType", is("LOGIN")))
                .andExpect(jsonPath("$.data[0].referenceId", is("session-123")))
                .andExpect(jsonPath("$.data[0].metadata.device", is("web")));

        // Also check if streak was updated (should now be 1 as today was active)
        mockMvc.perform(get("/api/v1/analytics/streak")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.currentStreak", is(1)))
                .andExpect(jsonPath("$.data.longestStreak", is(1)));
    }

    @Test
    @Order(7)
    @DisplayName("GET /insights, /recommendations, /trends, /predictions — retrieves intelligence correctly")
    void getIntelligence_success() throws Exception {
        mockMvc.perform(get("/api/v1/analytics/insights")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data", is(notNullValue())));

        mockMvc.perform(get("/api/v1/analytics/recommendations")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data", is(notNullValue())));

        mockMvc.perform(get("/api/v1/analytics/trends")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data", is(notNullValue())));

        mockMvc.perform(get("/api/v1/analytics/predictions")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data", is(notNullValue())));
    }
}
