package com.learnpath.analytics.dto;

import com.learnpath.analytics.entity.AnalyticsTrend;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record AnalyticsTrendResponse(
        UUID id,
        UUID userId,
        String metricName,
        BigDecimal previousValue,
        BigDecimal currentValue,
        String trendDirection,
        BigDecimal improvementPercent,
        Instant calculatedAt
) {
    public static AnalyticsTrendResponse from(AnalyticsTrend trend) {
        if (trend == null) return null;
        return new AnalyticsTrendResponse(
                trend.getId(),
                trend.getUserId(),
                trend.getMetricName(),
                trend.getPreviousValue(),
                trend.getCurrentValue(),
                trend.getTrendDirection(),
                trend.getImprovementPercent(),
                trend.getCalculatedAt()
        );
    }
}
