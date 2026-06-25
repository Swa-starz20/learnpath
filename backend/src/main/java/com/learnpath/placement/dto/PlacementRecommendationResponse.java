package com.learnpath.placement.dto;

import com.learnpath.placement.entity.PlacementRecommendation;
import java.time.Instant;
import java.util.UUID;

public record PlacementRecommendationResponse(
        UUID id,
        UUID userId,
        UUID profileId,
        UUID assessmentResultId,
        String recommendationType,
        String title,
        String description,
        String actionUrl,
        boolean active,
        UUID insightId,
        Instant createdAt
) {
    public static PlacementRecommendationResponse from(PlacementRecommendation r) {
        if (r == null) return null;
        return new PlacementRecommendationResponse(
                r.getId(),
                r.getUserId(),
                r.getProfile().getId(),
                r.getAssessmentResultId(),
                r.getRecommendationType(),
                r.getTitle(),
                r.getDescription(),
                r.getActionUrl(),
                r.isActive(),
                r.getInsight() != null ? r.getInsight().getId() : null,
                r.getCreatedAt()
        );
    }
}
