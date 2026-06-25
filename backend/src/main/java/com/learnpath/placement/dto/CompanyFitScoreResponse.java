package com.learnpath.placement.dto;

import com.learnpath.placement.entity.CompanyFitScore;
import java.time.Instant;
import java.util.UUID;

public record CompanyFitScoreResponse(
        UUID id,
        UUID profileId,
        UUID assessmentResultId,
        String targetCompany,
        String targetRole,
        int fitScore,
        String confidenceLevel,
        Instant createdAt
) {
    public static CompanyFitScoreResponse from(CompanyFitScore f) {
        if (f == null) return null;
        return new CompanyFitScoreResponse(
                f.getId(),
                f.getProfile().getId(),
                f.getAssessmentResultId(),
                f.getTargetCompany(),
                f.getTargetRole(),
                f.getFitScore(),
                f.getConfidenceLevel(),
                f.getCreatedAt()
        );
    }
}
