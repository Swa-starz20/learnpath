package com.learnpath.notification;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.learnpath.auth.dto.RegisterRequest;
import com.learnpath.notification.dto.UpdateNotificationPreferenceRequest;
import com.learnpath.notification.entity.Notification;
import com.learnpath.notification.entity.NotificationStatus;
import com.learnpath.notification.repository.NotificationRepository;
import com.learnpath.notification.service.NotificationService;
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
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Testcontainers
@ActiveProfiles("test")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class NotificationControllerIntegrationTest {

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
    private NotificationService notificationService;

    @Autowired
    private NotificationRepository notificationRepository;

    private static String token;
    private static UUID userId;

    @Test
    @Order(1)
    @DisplayName("Setup test user")
    void setup() throws Exception {
        RegisterRequest registerRequest = new RegisterRequest(
                "notification.test@learnpath.dev", "Secure1234", "Notification", "Tester");
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
    @DisplayName("Verify unauthenticated access returns 401")
    void verifyUnauthenticated() throws Exception {
        mockMvc.perform(get("/api/v1/notifications"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @Order(3)
    @DisplayName("Verify preferences operations")
    void verifyPreferences() throws Exception {
        mockMvc.perform(get("/api/v1/notifications/preferences")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.userId", is(userId.toString())))
                .andExpect(jsonPath("$.data.emailEnabled", is(true)))
                .andExpect(jsonPath("$.data.inAppEnabled", is(true)));

        UpdateNotificationPreferenceRequest updateRequest = new UpdateNotificationPreferenceRequest(
                false, true, true, true, true, false, true
        );

        mockMvc.perform(put("/api/v1/notifications/preferences")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.assessmentNotifications", is(false)))
                .andExpect(jsonPath("$.data.emailEnabled", is(false)));
    }

    @Test
    @Order(4)
    @DisplayName("Verify notifications operations")
    void verifyNotifications() throws Exception {
        notificationService.createNotification(
                userId, "ROADMAP", "New Node Available", "You can now learn React.", "HIGH", "/roadmap/1");

        mockMvc.perform(get("/api/v1/notifications/count")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.unreadCount", is(1)));

        MvcResult unreadResult = mockMvc.perform(get("/api/v1/notifications/unread")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data", hasSize(1)))
                .andExpect(jsonPath("$.data[0].title", is("New Node Available")))
                .andExpect(jsonPath("$.data[0].status", is("UNREAD")))
                .andReturn();

        String notificationId = objectMapper.readTree(unreadResult.getResponse().getContentAsString())
                .path("data").path(0).path("id").asText();

        mockMvc.perform(put("/api/v1/notifications/" + notificationId + "/read")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.status", is("READ")));

        mockMvc.perform(get("/api/v1/notifications/count")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.unreadCount", is(0)));
    }

    @Test
    @Order(5)
    @DisplayName("Verify read-all and preference skips")
    void verifyReadAllAndSkips() throws Exception {
        notificationService.createNotification(
                userId, "MENTOR", "Review Suggestion", "Your mentor has suggested a path.", "MEDIUM", "/mentor");

        notificationService.createNotification(
                userId, "ASSESSMENT", "Test", "Test message", "MEDIUM", "/test");

        mockMvc.perform(get("/api/v1/notifications/count")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.unreadCount", is(1)));

        mockMvc.perform(put("/api/v1/notifications/read-all")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)));

        mockMvc.perform(get("/api/v1/notifications/count")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.unreadCount", is(0)));
    }
}
