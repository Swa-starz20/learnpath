package com.learnpath.placement.dto;

import com.learnpath.placement.entity.PlacementInsight;
import java.time.Instant;
import java.util.UUID;

public record PlacementInsightResponse(
        UUID id,
        UUID userId,
        UUID profileId,
        UUID assessmentResultId,
        String insightType,
        String category,
        String title,
        String description,
        Instant createdAt
) {
    public static PlacementInsightResponse from(PlacementInsight i) {
        if (i == null) return null;
        return new PlacementInsightResponse(
                i.getId(),
                i.getUserId(),
                i.getProfile().getId(),
                i.getAssessmentResultId(),
                i.getInsightType(),
                i.getCategory(),
                i.getTitle(),
                i.getDescription(),
                i.getCreatedAt()
        );
    }
}
