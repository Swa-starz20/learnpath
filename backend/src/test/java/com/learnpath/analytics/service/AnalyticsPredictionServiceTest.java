package com.learnpath.analytics.service;

import com.learnpath.analytics.entity.AnalyticsPrediction;
import com.learnpath.analytics.entity.AnalyticsSnapshot;
import com.learnpath.analytics.repository.AnalyticsPredictionRepository;
import com.learnpath.analytics.repository.AnalyticsSnapshotRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.when;

class AnalyticsPredictionServiceTest {

    private AnalyticsPredictionRepository predictionRepository;
    private AnalyticsSnapshotRepository snapshotRepository;
    private AnalyticsPredictionService predictionService;

    @BeforeEach
    void setUp() {
        predictionRepository = Mockito.mock(AnalyticsPredictionRepository.class);
        snapshotRepository = Mockito.mock(AnalyticsSnapshotRepository.class);
        predictionService = new AnalyticsPredictionService(predictionRepository, snapshotRepository);

        when(predictionRepository.saveAll(anyList())).thenAnswer(invocation -> invocation.getArgument(0));
    }

    @Test
    void generatePredictions_noSnapshot_returnsEmpty() {
        UUID userId = UUID.randomUUID();
        when(snapshotRepository.findByUserIdOrderBySnapshotTimeDesc(userId)).thenReturn(List.of());

        List<AnalyticsPrediction> predictions = predictionService.generatePredictions(userId);
        assertTrue(predictions.isEmpty());
    }

    @Test
    void generatePredictions_triggersPredictionsCorrectly() {
        UUID userId = UUID.randomUUID();
        AnalyticsSnapshot latest = new AnalyticsSnapshot(
                userId,
                BigDecimal.valueOf(50.00),
                BigDecimal.valueOf(60.00),
                BigDecimal.valueOf(70.00),
                BigDecimal.valueOf(80.00),
                100,
                BigDecimal.valueOf(90.00)
        );

        when(snapshotRepository.findByUserIdOrderBySnapshotTimeDesc(userId)).thenReturn(List.of(latest));
        when(predictionRepository.findByUserIdOrderByCreatedAtDesc(userId)).thenReturn(List.of());

        List<AnalyticsPrediction> predictions = predictionService.generatePredictions(userId);
        assertEquals(4, predictions.size());

        assertTrue(hasPrediction(predictions, "READINESS_FORECAST"));
        assertTrue(hasPrediction(predictions, "ROADMAP_COMPLETION_ESTIMATE"));
        assertTrue(hasPrediction(predictions, "MASTERY_EXPECTATION"));
        assertTrue(hasPrediction(predictions, "XP_EXPECTATION"));

        AnalyticsPrediction xpPrediction = findPrediction(predictions, "XP_EXPECTATION");
        assertNotNull(xpPrediction);
        assertEquals(BigDecimal.valueOf(250.00).setScale(2), xpPrediction.getPredictedScore());
    }

    private boolean hasPrediction(List<AnalyticsPrediction> predictions, String type) {
        return predictions.stream().anyMatch(p -> p.getPredictionType().equals(type));
    }

    private AnalyticsPrediction findPrediction(List<AnalyticsPrediction> predictions, String type) {
        return predictions.stream().filter(p -> p.getPredictionType().equals(type)).findFirst().orElse(null);
    }
}
