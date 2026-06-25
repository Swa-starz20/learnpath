package com.learnpath.analytics.service;

import com.learnpath.analytics.dto.AnalyticsSnapshotResponse;
import com.learnpath.analytics.entity.AnalyticsTrend;
import com.learnpath.analytics.event.AnalyticsGeneratedEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class AnalyticsIntelligenceService {

    private static final Logger log = LoggerFactory.getLogger(AnalyticsIntelligenceService.class);

    private final AnalyticsService analyticsService;
    private final AnalyticsTrendAnalyzer trendAnalyzer;
    private final AnalyticsInsightGenerator insightGenerator;
    private final AnalyticsRecommendationGenerator recommendationGenerator;
    private final AnalyticsPredictionService predictionService;
    private final ApplicationEventPublisher eventPublisher;

    public AnalyticsIntelligenceService(
            AnalyticsService analyticsService,
            AnalyticsTrendAnalyzer trendAnalyzer,
            AnalyticsInsightGenerator insightGenerator,
            AnalyticsRecommendationGenerator recommendationGenerator,
            AnalyticsPredictionService predictionService,
            ApplicationEventPublisher eventPublisher) {
        this.analyticsService = analyticsService;
        this.trendAnalyzer = trendAnalyzer;
        this.insightGenerator = insightGenerator;
        this.recommendationGenerator = recommendationGenerator;
        this.predictionService = predictionService;
        this.eventPublisher = eventPublisher;
    }

    @Transactional
    public void processAnalyticsIntelligence(UUID userId) {
        log.info("Processing analytics intelligence for user: {}", userId);

        // 1. Calculate snapshot
        AnalyticsSnapshotResponse snapshotResponse = analyticsService.calculateAndSaveSnapshot(userId);
        UUID snapshotId = snapshotResponse.id();

        // 2. Trend analysis
        List<AnalyticsTrend> trends = trendAnalyzer.analyzeTrends(userId);

        // 3. Insight generation
        insightGenerator.generateInsights(userId, trends);

        // 4. Recommendation generation
        recommendationGenerator.generateRecommendations(userId);

        // 5. Prediction generation
        predictionService.generatePredictions(userId);

        // 6. Publish event
        AnalyticsGeneratedEvent event = new AnalyticsGeneratedEvent(userId, snapshotId, Instant.now());
        eventPublisher.publishEvent(event);

        log.info("Analytics intelligence processing complete for user: {}, snapshotId: {}", userId, snapshotId);
    }
}
