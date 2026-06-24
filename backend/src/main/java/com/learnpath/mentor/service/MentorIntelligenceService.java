package com.learnpath.mentor.service;

import com.learnpath.assessment.entity.AssessmentMetric;
import com.learnpath.assessment.repository.AssessmentMetricRepository;
import com.learnpath.mentor.entity.MentorInsight;
import com.learnpath.mentor.entity.MentorRecommendation;
import com.learnpath.mentor.repository.MentorInsightRepository;
import com.learnpath.mentor.repository.MentorRecommendationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

/**
 * Service that orchestrates mentor intelligence generation (insights and recommendations)
 * based on assessment completion.
 */
@Service
public class MentorIntelligenceService {

    private static final Logger log = LoggerFactory.getLogger(MentorIntelligenceService.class);

    private final AssessmentMetricRepository metricRepository;
    private final MentorInsightRepository insightRepository;
    private final MentorRecommendationRepository recommendationRepository;
    private final MentorInsightGenerator insightGenerator;
    private final MentorRecommendationGenerator recommendationGenerator;

    public MentorIntelligenceService(
            AssessmentMetricRepository metricRepository,
            MentorInsightRepository insightRepository,
            MentorRecommendationRepository recommendationRepository,
            MentorInsightGenerator insightGenerator,
            MentorRecommendationGenerator recommendationGenerator) {
        this.metricRepository = metricRepository;
        this.insightRepository = insightRepository;
        this.recommendationRepository = recommendationRepository;
        this.insightGenerator = insightGenerator;
        this.recommendationGenerator = recommendationGenerator;
    }

    /**
     * Processes assessment completion.
     * Generates and persists insights and recommendations if they do not already exist.
     */
    @Transactional
    public void processAssessmentCompletion(UUID userId, UUID resultId) {
        log.info("Starting mentor intelligence processing for user: {}, result: {}", userId, resultId);

        // Fetch metrics associated with the assessment result
        AssessmentMetric metrics = metricRepository.findByAssessmentResultId(resultId).orElse(null);
        if (metrics == null) {
            log.warn("No assessment metrics found for result ID: {}. Skipping mentor intelligence generation.", resultId);
            return;
        }

        // 1. Generate and persist insights (avoid duplicate user + type + assessment)
        List<MentorInsight> generatedInsights = insightGenerator.generateInsights(userId, metrics);
        for (MentorInsight insight : generatedInsights) {
            boolean exists = insightRepository.existsByUserIdAndInsightTypeAndAssessmentResultId(
                    userId, insight.getInsightType(), resultId
            );
            if (!exists) {
                insightRepository.save(insight);
                log.debug("Persisted new mentor insight: type={}, user={}", insight.getInsightType(), userId);
            } else {
                log.debug("Duplicate insight skipped: type={}, user={}, result={}",
                        insight.getInsightType(), userId, resultId);
            }
        }

        // 2. Generate and persist recommendations (avoid duplicate active recommendations)
        List<MentorRecommendation> generatedRecs = recommendationGenerator.generateRecommendations(userId, metrics);
        for (MentorRecommendation rec : generatedRecs) {
            boolean existsActive = recommendationRepository.existsByUserIdAndRecommendationTypeAndCompletedFalse(
                    userId, rec.getRecommendationType()
            );
            if (!existsActive) {
                recommendationRepository.save(rec);
                log.debug("Persisted new mentor recommendation: type={}, user={}", rec.getRecommendationType(), userId);
            } else {
                log.debug("Duplicate active recommendation skipped: type={}, user={}",
                        rec.getRecommendationType(), userId);
            }
        }

        log.info("Completed mentor intelligence processing for user: {}", userId);
    }
}
