package com.learnpath.mentor;

import com.learnpath.assessment.entity.*;
import com.learnpath.assessment.event.AssessmentCompletedEvent;
import com.learnpath.assessment.repository.*;
import com.learnpath.domain.entity.Domain;
import com.learnpath.domain.repository.DomainRepository;
import com.learnpath.mentor.entity.MentorInsight;
import com.learnpath.mentor.entity.MentorRecommendation;
import com.learnpath.mentor.repository.MentorInsightRepository;
import com.learnpath.mentor.repository.MentorRecommendationRepository;
import com.learnpath.user.entity.User;
import com.learnpath.user.repository.UserRepository;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.transaction.support.TransactionTemplate;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Integration tests verifying event listener binding, insight and recommendation generation,
 * scoring thresholds, and duplicate prevention.
 */
@SpringBootTest
@Testcontainers
@ActiveProfiles("test")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class MentorIntelligenceIntegrationTest {

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
    private MentorInsightRepository insightRepository;

    @Autowired
    private MentorRecommendationRepository recommendationRepository;

    private static UUID userId;
    private static UUID resultId;

    @BeforeEach
    void cleanDb() {
        insightRepository.deleteAll();
        recommendationRepository.deleteAll();
    }

    @Test
    @Order(1)
    @DisplayName("End-to-End Event-Driven Generation with Low Scores")
    void testLowScoresIntelligenceFlow() throws Exception {
        // Create and save user to satisfy foreign key constraint
        User user = new User("mentor.low.user@learnpath.dev", "Secure1234", "Mentor", "LowUser");
        user = userRepository.save(user);
        userId = user.getId();

        // 1. Fetch domain and create assessment template
        Domain domain = domainRepository.findByCode("COMP_ENG")
                .orElseThrow(() -> new IllegalStateException("COMP_ENG domain not found"));

        AssessmentTemplate template = new AssessmentTemplate(
                "MENTOR_INT_TEST_1", "Mentor test template", "Description",
                "QUIZ", domain, 30, 1
        );
        template = templateRepository.save(template);

        // 2. Create assessment session, result and metric with low technical and communication scores
        AssessmentSession session = new AssessmentSession(userId, template);
        session.submit(120);
        final AssessmentSession savedSession = sessionRepository.save(session);

        AssessmentResult result = new AssessmentResult(savedSession, userId, template);
        result.setScorePercentage(new BigDecimal("45.00"));
        final AssessmentResult savedResult = resultRepository.save(result);
        resultId = savedResult.getId();
        final UUID finalResultId = resultId;

        AssessmentMetric metric = new AssessmentMetric(savedResult, userId, template);
        metric.setOverallScore(new BigDecimal("45.00"));
        metric.setTechnicalScore(new BigDecimal("40.00")); // Low
        metric.setAptitudeScore(new BigDecimal("70.00"));    // Passing
        metric.setBehavioralScore(new BigDecimal("75.00"));   // Passing
        metric.setCommunicationScore(new BigDecimal("30.00")); // Low
        metric.setDomainReadinessScore(new BigDecimal("45.00")); // Low (<50)
        metricRepository.save(metric);

        // 3. Publish AssessmentCompletedEvent inside a transaction to trigger AFTER_COMMIT listener
        transactionTemplate.executeWithoutResult(status -> {
            AssessmentCompletedEvent event = new AssessmentCompletedEvent(
                    savedSession.getId(),
                    userId,
                    finalResultId,
                    new BigDecimal("45.00"),
                    new ArrayList<>()
            );
            eventPublisher.publishEvent(event);
        });

        // Assert database values after transaction commits
        List<MentorInsight> insights = insightRepository.findByUserIdOrderByGeneratedAtDesc(userId);
        assertNotNull(insights);
        // Low Technical (<60), Low Communication (<60), Low Domain Readiness (<50) -> 3 insights expected
        assertEquals(3, insights.size());

        boolean hasTech = insights.stream().anyMatch(i -> i.getInsightType().equals("TECHNICAL"));
        boolean hasComm = insights.stream().anyMatch(i -> i.getInsightType().equals("COMMUNICATION"));
        boolean hasReadiness = insights.stream().anyMatch(i -> i.getInsightType().equals("READINESS"));

        assertTrue(hasTech);
        assertTrue(hasComm);
        assertTrue(hasReadiness);

        List<MentorRecommendation> recs = recommendationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        assertNotNull(recs);
        // Low Technical -> ROADMAP_FUNDAMENTALS
        // Low Communication -> COMMUNICATION_PRACTICE
        // Low Readiness (<60) -> SKILL_STRENGTHENING
        // Total 3 recommendations expected
        assertEquals(3, recs.size());

        boolean hasRoadmap = recs.stream().anyMatch(r -> r.getRecommendationType().equals("ROADMAP_FUNDAMENTALS"));
        boolean hasCommPractice = recs.stream().anyMatch(r -> r.getRecommendationType().equals("COMMUNICATION_PRACTICE"));
        boolean hasSkillStrengthen = recs.stream().anyMatch(r -> r.getRecommendationType().equals("SKILL_STRENGTHENING"));

        assertTrue(hasRoadmap);
        assertTrue(hasCommPractice);
        assertTrue(hasSkillStrengthen);

        // 4. Duplicate prevention test: republish same event
        transactionTemplate.executeWithoutResult(status -> {
            AssessmentCompletedEvent event = new AssessmentCompletedEvent(
                    savedSession.getId(),
                    userId,
                    finalResultId,
                    new BigDecimal("45.00"),
                    new ArrayList<>()
            );
            eventPublisher.publishEvent(event);
        });

        // Verify count remains the same
        List<MentorInsight> insightsAfter = insightRepository.findByUserIdOrderByGeneratedAtDesc(userId);
        assertEquals(3, insightsAfter.size());

        List<MentorRecommendation> recsAfter = recommendationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        assertEquals(3, recsAfter.size());
    }

    @Test
    @Order(2)
    @DisplayName("End-to-End Event-Driven Generation with High Score")
    void testHighScoreIntelligenceFlow() throws Exception {
        User user2 = new User("mentor.high.user@learnpath.dev", "Secure1234", "Mentor", "HighUser");
        user2 = userRepository.save(user2);
        final UUID newUserId = user2.getId();

        Domain domain = domainRepository.findByCode("COMP_ENG")
                .orElseThrow(() -> new IllegalStateException("COMP_ENG domain not found"));

        AssessmentTemplate template = templateRepository.findAll().stream()
                .filter(t -> t.getCode().equals("MENTOR_INT_TEST_1")).findFirst()
                .orElseThrow();

        AssessmentSession session = new AssessmentSession(newUserId, template);
        session.submit(120);
        final AssessmentSession savedSession = sessionRepository.save(session);

        AssessmentResult result = new AssessmentResult(savedSession, newUserId, template);
        result.setScorePercentage(new BigDecimal("90.00"));
        final AssessmentResult savedResult = resultRepository.save(result);
        final UUID finalResultId = savedResult.getId();

        AssessmentMetric metric = new AssessmentMetric(savedResult, newUserId, template);
        metric.setOverallScore(new BigDecimal("90.00"));
        metric.setTechnicalScore(new BigDecimal("90.00"));
        metric.setAptitudeScore(new BigDecimal("95.00"));
        metric.setBehavioralScore(new BigDecimal("92.00"));
        metric.setCommunicationScore(new BigDecimal("91.00"));
        metric.setDomainReadinessScore(new BigDecimal("93.00")); // High (>80)
        metricRepository.save(metric);

        transactionTemplate.executeWithoutResult(status -> {
            AssessmentCompletedEvent event = new AssessmentCompletedEvent(
                    savedSession.getId(),
                    newUserId,
                    finalResultId,
                    new BigDecimal("90.00"),
                    new ArrayList<>()
            );
            eventPublisher.publishEvent(event);
        });

        List<MentorInsight> insights = insightRepository.findByUserIdOrderByGeneratedAtDesc(newUserId);
        assertEquals(1, insights.size());
        assertEquals("READINESS", insights.get(0).getInsightType());
        assertEquals("Strong Career Readiness", insights.get(0).getTitle());

        List<MentorRecommendation> recs = recommendationRepository.findByUserIdOrderByCreatedAtDesc(newUserId);
        assertTrue(recs.isEmpty());
    }
}
