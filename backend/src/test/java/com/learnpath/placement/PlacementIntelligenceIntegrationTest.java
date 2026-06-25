package com.learnpath.placement;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.learnpath.auth.dto.RegisterRequest;
import com.learnpath.assessment.entity.AssessmentMetric;
import com.learnpath.assessment.entity.AssessmentResult;
import com.learnpath.assessment.entity.AssessmentSession;
import com.learnpath.assessment.entity.AssessmentTemplate;
import com.learnpath.assessment.event.AssessmentCompletedEvent;
import com.learnpath.assessment.repository.AssessmentMetricRepository;
import com.learnpath.assessment.repository.AssessmentResultRepository;
import com.learnpath.assessment.repository.AssessmentSessionRepository;
import com.learnpath.assessment.repository.AssessmentTemplateRepository;
import com.learnpath.domain.entity.Domain;
import com.learnpath.domain.repository.DomainRepository;
import com.learnpath.placement.entity.*;
import com.learnpath.placement.repository.*;
import com.learnpath.user.entity.User;
import com.learnpath.user.repository.UserRepository;
import com.learnpath.skill.entity.Skill;
import com.learnpath.skill.repository.SkillRepository;
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
class PlacementIntelligenceIntegrationTest {

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
    private TransactionTemplate transactionTemplate;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DomainRepository domainRepository;

    @Autowired
    private AssessmentTemplateRepository templateRepository;

    @Autowired
    private AssessmentSessionRepository sessionRepository;

    @Autowired
    private AssessmentResultRepository resultRepository;

    @Autowired
    private AssessmentMetricRepository metricRepository;

    @Autowired
    private PlacementProfileRepository profileRepository;

    @Autowired
    private PlacementTargetRepository targetRepository;

    @Autowired
    private PlacementReadinessRepository readinessRepository;

    @Autowired
    private PlacementInsightRepository insightRepository;

    @Autowired
    private PlacementRecommendationRepository recommendationRepository;

    @Autowired
    private CompanyFitScoreRepository companyFitScoreRepository;

    @Autowired
    private SkillGapAnalysisRepository skillGapAnalysisRepository;

    @Autowired
    private SkillRepository skillRepository;

    private static String token;
    private static UUID userId;
    private static Long domainId;
    private static UUID resultId;
    private static UUID sessionId;

    @Test
    @Order(1)
    @DisplayName("Setup test environment, create profile and targets")
    void setup() throws Exception {
        RegisterRequest registerRequest = new RegisterRequest(
                "placement.intel@learnpath.dev", "Secure1234", "Placement", "Intel");
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

        // Create a mock skill for COMP_ENG domain
        Skill skill = new Skill(domain, "Java Programming", "Core Java", "Languages");
        skillRepository.save(skill);

        // Create a placement profile
        PlacementProfile profile = new PlacementProfile(userId, domainId, new BigDecimal("8.00"), new BigDecimal("15.00"), "Hyderabad");
        profile = profileRepository.save(profile);

        // Add a placement target
        PlacementTarget target = new PlacementTarget(profile, "Netflix", "Software Engineer", 1);
        targetRepository.save(target);
    }

    @Test
    @Order(2)
    @DisplayName("Publish AssessmentCompletedEvent and generate placement intelligence")
    void processAssessmentCompletedEvent() {
        Domain domain = domainRepository.findById(domainId).orElseThrow();
        User user = userRepository.findById(userId).orElseThrow();

        // 1. Create mock assessment data
        AssessmentTemplate template = new AssessmentTemplate("INTEL_TEMPLATE", "Intel Test", "Desc", "QUIZ", domain, 30, 5);
        template = templateRepository.save(template);

        AssessmentSession session = new AssessmentSession(userId, template);
        session = sessionRepository.save(session);
        sessionId = session.getId();

        AssessmentResult result = new AssessmentResult(session, userId, template);
        result.setScorePercentage(new BigDecimal("45.00"));
        result = resultRepository.save(result);
        resultId = result.getId();

        AssessmentMetric metric = new AssessmentMetric(result, userId, template);
        metric.setOverallScore(new BigDecimal("45.00"));
        metric.setTechnicalScore(new BigDecimal("40.00")); // Low
        metric.setAptitudeScore(new BigDecimal("35.00"));    // Low
        metric.setBehavioralScore(new BigDecimal("85.00"));   // High
        metric.setCommunicationScore(new BigDecimal("30.00")); // Low
        metric.setDomainReadinessScore(new BigDecimal("45.00"));
        metricRepository.save(metric);

        // 2. Publish event inside transactional boundary
        final UUID finalResultId = resultId;
        transactionTemplate.executeWithoutResult(status -> {
            AssessmentCompletedEvent event = new AssessmentCompletedEvent(
                    sessionId,
                    userId,
                    finalResultId,
                    new BigDecimal("45.00"),
                    new ArrayList<>()
            );
            eventPublisher.publishEvent(event);
        });

        // 3. Verify intelligence generation
        List<PlacementReadiness> readiness = readinessRepository.findByProfileId(profileRepository.findByUserIdAndDomainId(userId, domainId).get().getId());
        assertNotNull(readiness);
        assertEquals(1, readiness.size());
        assertEquals(new BigDecimal("45.00"), readiness.get(0).getReadinessScore());

        List<PlacementInsight> insights = insightRepository.findByAssessmentResultId(resultId);
        assertNotNull(insights);
        // Low Technical, Low Aptitude, Low Communication, High Behavioral, Low Overall -> 5 insights expected
        assertEquals(5, insights.size());

        List<PlacementRecommendation> recommendations = recommendationRepository.findByAssessmentResultId(resultId);
        assertNotNull(recommendations);
        // Recs mapped to low categories -> Retake, Mock, Technical Course, Roadmap -> 4 recommendations expected
        assertEquals(4, recommendations.size());

        List<CompanyFitScore> fitScores = companyFitScoreRepository.findByAssessmentResultId(resultId);
        assertNotNull(fitScores);
        assertEquals(1, fitScores.size());
        assertEquals("Netflix", fitScores.get(0).getTargetCompany());

        List<SkillGapAnalysis> gaps = skillGapAnalysisRepository.findByAssessmentResultId(resultId);
        assertNotNull(gaps);
        // Comp Eng has pre-seeded skills, since user has 0 confidence, they should all be gaps
        assertTrue(gaps.size() > 0);
    }

    @Test
    @Order(3)
    @DisplayName("Verify idempotency on republishing event")
    void testIdempotency() {
        // Publish the same event again
        transactionTemplate.executeWithoutResult(status -> {
            AssessmentCompletedEvent event = new AssessmentCompletedEvent(
                    sessionId,
                    userId,
                    resultId,
                    new BigDecimal("45.00"),
                    new ArrayList<>()
            );
            eventPublisher.publishEvent(event);
        });

        // Verify count is still exactly same
        List<PlacementReadiness> readiness = readinessRepository.findByProfileId(profileRepository.findByUserIdAndDomainId(userId, domainId).get().getId());
        assertEquals(1, readiness.size());

        List<PlacementInsight> insights = insightRepository.findByAssessmentResultId(resultId);
        assertEquals(5, insights.size());

        List<PlacementRecommendation> recommendations = recommendationRepository.findByAssessmentResultId(resultId);
        assertEquals(4, recommendations.size());

        List<CompanyFitScore> fitScores = companyFitScoreRepository.findByAssessmentResultId(resultId);
        assertEquals(1, fitScores.size());
    }

    @Test
    @Order(4)
    @DisplayName("Verify GET endpoints return generated intelligence data")
    void testGetEndpoints() throws Exception {
        mockMvc.perform(get("/api/v1/placements/readiness?domainId=" + domainId)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.readinessScore", is(45.0)));

        mockMvc.perform(get("/api/v1/placements/insights?domainId=" + domainId)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data", hasSize(5)));

        mockMvc.perform(get("/api/v1/placements/recommendations?domainId=" + domainId)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data", hasSize(4)));

        mockMvc.perform(get("/api/v1/placements/fit-scores?domainId=" + domainId)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data", hasSize(1)));

        mockMvc.perform(get("/api/v1/placements/gaps?domainId=" + domainId)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data", hasSize(greaterThan(0))));
    }
}
