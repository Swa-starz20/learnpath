package com.learnpath.assessment.dto;

import com.learnpath.assessment.entity.AssessmentResult;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

/**
 * Read-only view of an {@link AssessmentResult} for API responses.
 */
public record AssessmentResultResponse(
        UUID id,
        UUID sessionId,
        UUID userId,
        UUID templateId,
        String templateName,
        BigDecimal scorePercentage,
        Instant completedAt
) {
    public static AssessmentResultResponse from(AssessmentResult r) {
        return new AssessmentResultResponse(
                r.getId(),
                r.getSession().getId(),
                r.getUserId(),
                r.getTemplate().getId(),
                r.getTemplate().getName(),
                r.getScorePercentage(),
                r.getCompletedAt()
        );
    }
}
