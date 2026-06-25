package com.learnpath.analytics.dto;

import com.learnpath.analytics.entity.AnalyticsInsight;
import java.time.Instant;
import java.util.UUID;

public record AnalyticsInsightResponse(
        UUID id,
        UUID userId,
        String insightType,
        String title,
        String description,
        String priority,
        Instant generatedAt,
        UUID assessmentResultId,
        UUID snapshotId
) {
    public static AnalyticsInsightResponse from(AnalyticsInsight insight) {
        if (insight == null) return null;
        return new AnalyticsInsightResponse(
                insight.getId(),
                insight.getUserId(),
                insight.getInsightType(),
                insight.getTitle(),
                insight.getDescription(),
                insight.getPriority(),
                insight.getGeneratedAt(),
                insight.getAssessmentResultId(),
                insight.getSnapshotId()
        );
    }
}
