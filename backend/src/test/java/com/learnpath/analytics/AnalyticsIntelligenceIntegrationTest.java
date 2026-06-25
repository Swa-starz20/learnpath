package com.learnpath.analytics;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.learnpath.analytics.entity.*;
import com.learnpath.analytics.event.AnalyticsGeneratedEvent;
import com.learnpath.analytics.repository.*;
import com.learnpath.assessment.event.AssessmentCompletedEvent;
import com.learnpath.auth.dto.RegisterRequest;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;
import org.springframework.transaction.support.TransactionTemplate;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
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
@Import(AnalyticsIntelligenceIntegrationTest.TestConfig.class)
class AnalyticsIntelligenceIntegrationTest {

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

    @TestConfiguration
    static class TestConfig {
        @Bean
        public TestAnalyticsGeneratedEventListener testAnalyticsGeneratedEventListener() {
            return new TestAnalyticsGeneratedEventListener();
        }
    }

    static class TestAnalyticsGeneratedEventListener {
        private final List<AnalyticsGeneratedEvent> events = new java.util.concurrent.CopyOnWriteArrayList<>();

        @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
        @Transactional(propagation = Propagation.REQUIRES_NEW)
        public void onAnalyticsGenerated(AnalyticsGeneratedEvent event) {
            events.add(event);
        }

        public List<AnalyticsGeneratedEvent> getEvents() {
            return events;
        }

        public void clear() {
            events.clear();
        }
    }

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ApplicationEventPublisher eventPublisher;

    @Autowired
    private TransactionTemplate transactionTemplate;

    @Autowired
    private AnalyticsSnapshotRepository snapshotRepository;

    @Autowired
    private AnalyticsInsightRepository insightRepository;

    @Autowired
    private AnalyticsRecommendationRepository recommendationRepository;

    @Autowired
    private AnalyticsTrendRepository trendRepository;

    @Autowired
    private AnalyticsPredictionRepository predictionRepository;

    @Autowired
    private TestAnalyticsGeneratedEventListener testEventListener;

    private static String token;
    private static UUID userId;

    @Test
    @Order(1)
    @DisplayName("Setup user for intelligence tests")
    void setup() throws Exception {
        RegisterRequest registerRequest = new RegisterRequest(
                "intelligence.test@learnpath.dev", "Secure1234", "Analytics", "IntelligenceTester");
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
    @DisplayName("Verify event-driven intelligence generation and querying")
    void verifyEventDrivenPipeline() {
        testEventListener.clear();

        // 1. Publish AssessmentCompletedEvent to trigger pipeline
        transactionTemplate.executeWithoutResult(status -> {
            AssessmentCompletedEvent event = new AssessmentCompletedEvent(
                    UUID.randomUUID(),
                    userId,
                    UUID.randomUUID(),
                    BigDecimal.valueOf(85.00),
                    new ArrayList<>()
            );
            eventPublisher.publishEvent(event);
        });

        // 2. Verify AnalyticsGeneratedEvent was captured after commit
        List<AnalyticsGeneratedEvent> capturedEvents = testEventListener.getEvents();
        assertFalse(capturedEvents.isEmpty(), "Should capture AnalyticsGeneratedEvent");
        AnalyticsGeneratedEvent generatedEvent = capturedEvents.get(0);
        assertEquals(userId, generatedEvent.userId());
        assertNotNull(generatedEvent.snapshotId());

        // 3. Verify Database entities were written successfully
        List<AnalyticsSnapshot> snapshots = snapshotRepository.findByUserIdOrderBySnapshotTimeDesc(userId);
        assertFalse(snapshots.isEmpty(), "Snapshot should be created");
        assertEquals(generatedEvent.snapshotId(), snapshots.get(0).getId());

        List<AnalyticsInsight> insights = insightRepository.findByUserIdOrderByGeneratedAtDesc(userId);
        assertFalse(insights.isEmpty(), "Insights should be generated");

        List<AnalyticsRecommendation> recommendations = recommendationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        assertFalse(recommendations.isEmpty(), "Recommendations should be generated");

        List<AnalyticsTrend> trends = trendRepository.findByUserIdOrderByCalculatedAtDesc(userId);
        assertFalse(trends.isEmpty(), "Trends should be calculated");

        List<AnalyticsPrediction> predictions = predictionRepository.findByUserIdOrderByCreatedAtDesc(userId);
        assertFalse(predictions.isEmpty(), "Predictions should be generated");
    }

    @Test
    @Order(3)
    @DisplayName("Verify REST retrieval endpoints return populated datasets")
    void verifyRestEndpoints() throws Exception {
        mockMvc.perform(get("/api/v1/analytics/insights")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data", hasSize(greaterThan(0))));

        mockMvc.perform(get("/api/v1/analytics/recommendations")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data", hasSize(greaterThan(0))));

        mockMvc.perform(get("/api/v1/analytics/trends")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data", hasSize(greaterThan(0))));

        mockMvc.perform(get("/api/v1/analytics/predictions")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data", hasSize(greaterThan(0))));
    }
}
