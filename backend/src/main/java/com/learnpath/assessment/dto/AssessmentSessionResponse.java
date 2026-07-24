package com.learnpath.assessment.dto;

import com.learnpath.assessment.entity.AssessmentSession;

import java.time.Instant;
import java.util.UUID;

/**
 * Read-only view of an {@link AssessmentSession} for API responses.
 */
public record AssessmentSessionResponse(
        UUID id,
        UUID userId,
        UUID templateId,
        String templateName,
        String status,
        Instant startedAt,
        Instant submittedAt,
        Integer timeSpentSeconds
) {
    public static AssessmentSessionResponse from(AssessmentSession s) {
        return new AssessmentSessionResponse(
                s.getId(),
                s.getUserId(),
                s.getTemplate().getId(),
                s.getTemplate().getName(),
                s.getStatus(),
                s.getStartedAt(),
                s.getSubmittedAt(),
                s.getTimeSpentSeconds()
        );
    }
}
