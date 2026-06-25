package com.learnpath.analytics.dto;

import com.learnpath.analytics.entity.AnalyticsPrediction;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record AnalyticsPredictionResponse(
        UUID id,
        UUID userId,
        String predictionType,
        BigDecimal predictedScore,
        String confidence,
        String explanation,
        Instant createdAt
) {
    public static AnalyticsPredictionResponse from(AnalyticsPrediction pred) {
        if (pred == null) return null;
        return new AnalyticsPredictionResponse(
                pred.getId(),
                pred.getUserId(),
                pred.getPredictionType(),
                pred.getPredictedScore(),
                pred.getConfidence(),
                pred.getExplanation(),
                pred.getCreatedAt()
        );
    }
}
