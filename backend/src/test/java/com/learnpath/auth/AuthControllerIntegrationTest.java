package com.learnpath.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.learnpath.auth.dto.LoginRequest;
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

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the authentication flows.
 *
 * <p>Uses Testcontainers to spin up a real PostgreSQL container.
 * Flyway migrations (V1 + V2) run automatically on application start.
 */
@SpringBootTest
@AutoConfigureMockMvc
@Testcontainers
@ActiveProfiles("test")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class AuthControllerIntegrationTest {

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

    private static final String REGISTER_URL = "/api/v1/auth/register";
    private static final String LOGIN_URL    = "/api/v1/auth/login";
    private static final String ME_URL       = "/api/v1/auth/me";

    private static String accessToken;

    // ── Registration ──────────────────────────────────────────────────────────

    @Test
    @Order(1)
    @DisplayName("POST /register — successful registration returns 201 with token")
    void register_success() throws Exception {
        RegisterRequest request = new RegisterRequest(
                "alice@learnpath.dev", "Secure1234", "Alice", "Engineer");

        MvcResult result = mockMvc.perform(post(REGISTER_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.accessToken").isNotEmpty())
                .andExpect(jsonPath("$.data.tokenType").value("Bearer"))
                .andExpect(jsonPath("$.data.user.email").value("alice@learnpath.dev"))
                .andExpect(jsonPath("$.data.user.roles", hasItem("STUDENT")))
                .andReturn();

        String body = result.getResponse().getContentAsString();
        accessToken = objectMapper.readTree(body)
                .path("data").path("accessToken").asText();
    }

    @Test
    @Order(2)
    @DisplayName("POST /register — duplicate email returns 409")
    void register_duplicateEmail() throws Exception {
        RegisterRequest request = new RegisterRequest(
                "alice@learnpath.dev", "Secure1234", "Alice", "Duplicate");

        mockMvc.perform(post(REGISTER_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @Order(3)
    @DisplayName("POST /register — weak password returns 400 with field errors")
    void register_weakPassword() throws Exception {
        RegisterRequest request = new RegisterRequest(
                "bob@learnpath.dev", "weak", "Bob", "Builder");

        mockMvc.perform(post(REGISTER_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.errors.password").isNotEmpty());
    }

    @Test
    @Order(4)
    @DisplayName("POST /register — invalid email returns 400")
    void register_invalidEmail() throws Exception {
        RegisterRequest request = new RegisterRequest(
                "not-an-email", "Secure1234", "Bob", "Builder");

        mockMvc.perform(post(REGISTER_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.email").isNotEmpty());
    }

    // ── Login ─────────────────────────────────────────────────────────────────

    @Test
    @Order(5)
    @DisplayName("POST /login — valid credentials return 200 with token")
    void login_success() throws Exception {
        LoginRequest request = new LoginRequest("alice@learnpath.dev", "Secure1234");

        MvcResult result = mockMvc.perform(post(LOGIN_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.accessToken").isNotEmpty())
                .andExpect(jsonPath("$.data.user.email").value("alice@learnpath.dev"))
                .andReturn();

        // Update token for subsequent tests
        String body = result.getResponse().getContentAsString();
        accessToken = objectMapper.readTree(body)
                .path("data").path("accessToken").asText();
    }

    @Test
    @Order(6)
    @DisplayName("POST /login — wrong password returns 401")
    void login_wrongPassword() throws Exception {
        LoginRequest request = new LoginRequest("alice@learnpath.dev", "WrongPassword1");

        mockMvc.perform(post(LOGIN_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @Order(7)
    @DisplayName("POST /login — non-existent email returns 401 (no enumeration)")
    void login_nonExistentEmail() throws Exception {
        LoginRequest request = new LoginRequest("ghost@learnpath.dev", "Secure1234");

        mockMvc.perform(post(LOGIN_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Invalid email or password."));
    }

    // ── Current User ──────────────────────────────────────────────────────────

    @Test
    @Order(8)
    @DisplayName("GET /me — valid token returns current user")
    void me_success() throws Exception {
        Assumptions.assumeTrue(accessToken != null, "Skipping /me test — no access token from prior tests");

        mockMvc.perform(get(ME_URL)
                        .header("Authorization", "Bearer " + accessToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.email").value("alice@learnpath.dev"))
                .andExpect(jsonPath("$.data.roles", hasItem("STUDENT")));
    }

    @Test
    @Order(9)
    @DisplayName("GET /me — missing token returns 401")
    void me_noToken() throws Exception {
        mockMvc.perform(get(ME_URL))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @Order(10)
    @DisplayName("GET /me — malformed token returns 401")
    void me_invalidToken() throws Exception {
        mockMvc.perform(get(ME_URL)
                        .header("Authorization", "Bearer this.is.not.a.valid.jwt"))
                .andExpect(status().isUnauthorized());
    }
}
