package com.learnpath.placement;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.learnpath.auth.dto.RegisterRequest;
import com.learnpath.domain.entity.Domain;
import com.learnpath.domain.repository.DomainRepository;
import com.learnpath.placement.dto.*;
import com.learnpath.placement.repository.PlacementPreferenceRepository;
import com.learnpath.placement.repository.PlacementProfileRepository;
import com.learnpath.placement.repository.PlacementTargetRepository;
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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the Placement Foundation endpoints.
 */
@SpringBootTest
@AutoConfigureMockMvc
@Testcontainers
@ActiveProfiles("test")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class PlacementControllerIntegrationTest {

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
    private PlacementProfileRepository profileRepository;

    @Autowired
    private PlacementTargetRepository targetRepository;

    @Autowired
    private PlacementPreferenceRepository preferenceRepository;

    private static String token;
    private static UUID userId;
    private static Long domainId;

    @Test
    @Order(1)
    @DisplayName("Setup test user and fetch domain")
    void setup() throws Exception {
        RegisterRequest registerRequest = new RegisterRequest(
                "placement.test@learnpath.dev", "Secure1234", "Placement", "Tester");
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
    @DisplayName("GET /profile — unauthenticated access returns 401")
    void getProfile_unauthenticated() throws Exception {
        mockMvc.perform(get("/api/v1/placements/profile?domainId=" + domainId))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @Order(3)
    @DisplayName("POST /profile — unauthenticated access returns 401")
    void createProfile_unauthenticated() throws Exception {
        CreatePlacementProfileRequest request = new CreatePlacementProfileRequest(
                domainId, new BigDecimal("8.50"), new BigDecimal("12.00"), "Bangalore");
        mockMvc.perform(post("/api/v1/placements/profile")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @Order(4)
    @DisplayName("POST /profile — creates placement profile successfully")
    void createProfile_success() throws Exception {
        CreatePlacementProfileRequest request = new CreatePlacementProfileRequest(
                domainId, new BigDecimal("8.50"), new BigDecimal("12.00"), "Bangalore");
        mockMvc.perform(post("/api/v1/placements/profile")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.userId", is(userId.toString())))
                .andExpect(jsonPath("$.data.domainId", is(domainId.intValue())))
                .andExpect(jsonPath("$.data.currentCgpa", is(8.50)))
                .andExpect(jsonPath("$.data.targetPackageLpa", is(12.00)))
                .andExpect(jsonPath("$.data.preferredLocation", is("Bangalore")));
    }

    @Test
    @Order(5)
    @DisplayName("POST /profile — returns 409 conflict when duplicate profile")
    void createProfile_duplicate() throws Exception {
        CreatePlacementProfileRequest request = new CreatePlacementProfileRequest(
                domainId, new BigDecimal("9.00"), new BigDecimal("15.00"), "Pune");
        mockMvc.perform(post("/api/v1/placements/profile")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.success", is(false)))
                .andExpect(jsonPath("$.message", containsString("Placement profile already exists")));
    }

    @Test
    @Order(6)
    @DisplayName("GET /profile — retrieves placement profile successfully")
    void getProfile_success() throws Exception {
        mockMvc.perform(get("/api/v1/placements/profile?domainId=" + domainId)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.userId", is(userId.toString())))
                .andExpect(jsonPath("$.data.domainId", is(domainId.intValue())))
                .andExpect(jsonPath("$.data.currentCgpa", is(8.50)));
    }

    @Test
    @Order(7)
    @DisplayName("PUT /profile — updates placement profile successfully")
    void updateProfile_success() throws Exception {
        UpdatePlacementProfileRequest request = new UpdatePlacementProfileRequest(
                new BigDecimal("9.10"), new BigDecimal("18.50"), "Mumbai");
        mockMvc.perform(put("/api/v1/placements/profile?domainId=" + domainId)
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.currentCgpa", is(9.10)))
                .andExpect(jsonPath("$.data.targetPackageLpa", is(18.50)))
                .andExpect(jsonPath("$.data.preferredLocation", is("Mumbai")));
    }

    @Test
    @Order(8)
    @DisplayName("POST /targets — adds a target company successfully")
    void addTarget_success() throws Exception {
        CreatePlacementTargetRequest request = new CreatePlacementTargetRequest(
                domainId, "Google", "Software Engineer", 1);
        mockMvc.perform(post("/api/v1/placements/targets")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.companyName", is("Google")))
                .andExpect(jsonPath("$.data.roleName", is("Software Engineer")))
                .andExpect(jsonPath("$.data.priority", is(1)));
    }

    @Test
    @Order(9)
    @DisplayName("GET /targets — retrieves placement targets successfully")
    void listTargets_success() throws Exception {
        mockMvc.perform(get("/api/v1/placements/targets?domainId=" + domainId)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data", hasSize(1)))
                .andExpect(jsonPath("$.data[0].companyName", is("Google")));
    }

    @Test
    @Order(10)
    @DisplayName("PUT /preferences — updates placement preferences successfully")
    void updatePreferences_success() throws Exception {
        UpdatePlacementPreferenceRequest request = new UpdatePlacementPreferenceRequest(
                domainId, true, false, true, "1000+", "Technology");
        mockMvc.perform(put("/api/v1/placements/preferences")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.prefersRemote", is(true)))
                .andExpect(jsonPath("$.data.prefersHybrid", is(false)))
                .andExpect(jsonPath("$.data.prefersOnsite", is(true)))
                .andExpect(jsonPath("$.data.preferredCompanySize", is("1000+")))
                .andExpect(jsonPath("$.data.preferredIndustry", is("Technology")));
    }

    @Test
    @Order(11)
    @DisplayName("GET /preferences — retrieves placement preferences successfully")
    void getPreferences_success() throws Exception {
        mockMvc.perform(get("/api/v1/placements/preferences?domainId=" + domainId)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.prefersRemote", is(true)))
                .andExpect(jsonPath("$.data.prefersOnsite", is(true)))
                .andExpect(jsonPath("$.data.preferredCompanySize", is("1000+")));
    }
}
