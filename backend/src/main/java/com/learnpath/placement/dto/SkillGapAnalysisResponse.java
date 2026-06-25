package com.learnpath.placement.dto;

import com.learnpath.placement.entity.SkillGapAnalysis;
import java.time.Instant;
import java.util.UUID;

public record SkillGapAnalysisResponse(
        UUID id,
        UUID profileId,
        UUID assessmentResultId,
        Long skillId,
        String skillName,
        String gapType,
        String severity,
        String recommendedAction,
        Instant createdAt
) {
    public static SkillGapAnalysisResponse from(SkillGapAnalysis g) {
        if (g == null) return null;
        return new SkillGapAnalysisResponse(
                g.getId(),
                g.getProfile().getId(),
                g.getAssessmentResultId(),
                g.getSkillId(),
                g.getSkillName(),
                g.getGapType(),
                g.getSeverity(),
                g.getRecommendedAction(),
                g.getCreatedAt()
        );
    }
}
