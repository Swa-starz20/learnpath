package com.learnpath.notification;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.learnpath.analytics.event.AnalyticsGeneratedEvent;
import com.learnpath.assessment.event.AssessmentCompletedEvent;
import com.learnpath.auth.dto.RegisterRequest;
import com.learnpath.notification.dto.UpdateNotificationPreferenceRequest;
import com.learnpath.notification.entity.DeliveryChannel;
import com.learnpath.notification.entity.DeliveryStatus;
import com.learnpath.notification.entity.Notification;
import com.learnpath.notification.repository.NotificationDeliveryLogRepository;
import com.learnpath.notification.repository.NotificationPreferenceRepository;
import com.learnpath.notification.repository.NotificationRepository;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.TransactionTemplate;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Testcontainers
@ActiveProfiles("test")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class NotificationIntelligenceIntegrationTest {

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
    private ApplicationEventPublisher eventPublisher;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private NotificationDeliveryLogRepository deliveryLogRepository;

    @Autowired
    private NotificationPreferenceRepository preferenceRepository;

    @Autowired
    private PlatformTransactionManager transactionManager;

    private static String token;
    private static UUID userId;

    @Test
    @Order(1)
    @DisplayName("Setup test user")
    void setup() throws Exception {
        RegisterRequest registerRequest = new RegisterRequest(
                "intelligence.test@learnpath.dev", "Secure1234", "Intel", "Tester");
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
    @DisplayName("Publish AssessmentCompletedEvent and verify notifications and delivery logs")
    void testAssessmentCompletedEvent() throws Exception {
        deliveryLogRepository.deleteAll();
        notificationRepository.deleteAll();

        TransactionTemplate transactionTemplate = new TransactionTemplate(transactionManager);
        transactionTemplate.execute(status -> {
            AssessmentCompletedEvent event = new AssessmentCompletedEvent(
                    UUID.randomUUID(),
                    userId,
                    UUID.randomUUID(),
                    BigDecimal.valueOf(85.5),
                    Collections.emptyList()
            );
            eventPublisher.publishEvent(event);
            return null;
        });

        List<Notification> notifications = notificationRepository.findByUserIdAndStatus(userId, com.learnpath.notification.entity.NotificationStatus.UNREAD);
        
        assertEquals(11, notifications.size(), "Should have created 11 notifications");

        long logCount = deliveryLogRepository.count();
        assertEquals(22, logCount, "Should have created 22 delivery logs");

        mockMvc.perform(get("/api/v1/notifications/delivery-log")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data", hasSize(22)))
                .andExpect(jsonPath("$.data[0].deliveryChannel", anyOf(is("EMAIL"), is("IN_APP"))))
                .andExpect(jsonPath("$.data[0].deliveryStatus", is("SENT")));
    }

    @Test
    @Order(3)
    @DisplayName("Verify duplicate notifications are skipped")
    void testDuplicatePrevention() {
        TransactionTemplate transactionTemplate = new TransactionTemplate(transactionManager);
        transactionTemplate.execute(status -> {
            AssessmentCompletedEvent event = new AssessmentCompletedEvent(
                    UUID.randomUUID(),
                    userId,
                    UUID.randomUUID(),
                    BigDecimal.valueOf(85.5),
                    Collections.emptyList()
            );
            eventPublisher.publishEvent(event);
            return null;
        });

        List<Notification> notifications = notificationRepository.findByUserIdAndStatus(userId, com.learnpath.notification.entity.NotificationStatus.UNREAD);
        assertEquals(11, notifications.size(), "Should still be 11 notifications because duplicate unread checking is active");
    }

    @Test
    @Order(4)
    @DisplayName("Publish AnalyticsGeneratedEvent and verify notifications and delivery logs")
    void testAnalyticsGeneratedEvent() throws Exception {
        deliveryLogRepository.deleteAll();
        notificationRepository.deleteAll();

        TransactionTemplate transactionTemplate = new TransactionTemplate(transactionManager);
        transactionTemplate.execute(status -> {
            AnalyticsGeneratedEvent event = new AnalyticsGeneratedEvent(
                    userId,
                    UUID.randomUUID(),
                    Instant.now()
            );
            eventPublisher.publishEvent(event);
            return null;
        });

        List<Notification> notifications = notificationRepository.findByUserIdAndStatus(userId, com.learnpath.notification.entity.NotificationStatus.UNREAD);
        assertEquals(4, notifications.size(), "Should have created 4 notifications");

        long logCount = deliveryLogRepository.count();
        assertEquals(8, logCount, "Should have created 8 delivery logs");
    }

    @Test
    @Order(5)
    @DisplayName("Verify user preferences filtering is respected")
    void testUserPreferencesFiltering() throws Exception {
        UpdateNotificationPreferenceRequest updateRequest = new UpdateNotificationPreferenceRequest(
                true, true, true, false, true, true, true
        );

        mockMvc.perform(put("/api/v1/notifications/preferences")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.analyticsNotifications", is(false)));

        deliveryLogRepository.deleteAll();
        notificationRepository.deleteAll();

        TransactionTemplate transactionTemplate = new TransactionTemplate(transactionManager);
        transactionTemplate.execute(status -> {
            AnalyticsGeneratedEvent event = new AnalyticsGeneratedEvent(
                    userId,
                    UUID.randomUUID(),
                    Instant.now()
            );
            eventPublisher.publishEvent(event);
            return null;
        });

        List<Notification> notifications = notificationRepository.findByUserIdAndStatus(userId, com.learnpath.notification.entity.NotificationStatus.UNREAD);
        assertTrue(notifications.isEmpty(), "Should skip creating notifications since category is disabled");

        long logCount = deliveryLogRepository.count();
        assertEquals(0, logCount, "Should skip logging since no notifications were sent");
    }
}
