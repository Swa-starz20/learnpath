package com.learnpath.analytics.dto;

import com.learnpath.analytics.entity.AnalyticsRecommendation;
import java.time.Instant;
import java.util.UUID;

public record AnalyticsRecommendationResponse(
        UUID id,
        UUID userId,
        String recommendationType,
        String title,
        String description,
        String actionUrl,
        boolean completed,
        Instant createdAt,
        Instant updatedAt
) {
    public static AnalyticsRecommendationResponse from(AnalyticsRecommendation rec) {
        if (rec == null) return null;
        return new AnalyticsRecommendationResponse(
                rec.getId(),
                rec.getUserId(),
                rec.getRecommendationType(),
                rec.getTitle(),
                rec.getDescription(),
                rec.getActionUrl(),
                rec.isCompleted(),
                rec.getCreatedAt(),
                rec.getUpdatedAt()
        );
    }
}
