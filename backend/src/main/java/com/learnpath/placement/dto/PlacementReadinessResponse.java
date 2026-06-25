package com.learnpath.placement.dto;

import com.learnpath.placement.entity.PlacementReadiness;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record PlacementReadinessResponse(
        UUID id,
        UUID profileId,
        UUID assessmentResultId,
        BigDecimal readinessScore,
        BigDecimal technicalScore,
        BigDecimal aptitudeScore,
        BigDecimal communicationScore,
        BigDecimal behavioralScore,
        Instant createdAt,
        Instant updatedAt
) {
    public static PlacementReadinessResponse from(PlacementReadiness r) {
        if (r == null) return null;
        return new PlacementReadinessResponse(
                r.getId(),
                r.getProfile().getId(),
                r.getAssessmentResultId(),
                r.getReadinessScore(),
                r.getTechnicalScore(),
                r.getAptitudeScore(),
                r.getCommunicationScore(),
                r.getBehavioralScore(),
                r.getCreatedAt(),
                r.getUpdatedAt()
        );
    }
}
