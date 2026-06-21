package com.learnpath.assessment.dto;

import com.learnpath.assessment.entity.AssessmentTemplate;

import java.time.Instant;
import java.util.UUID;

/**
 * Read-only view of an {@link AssessmentTemplate} for API responses.
 * Domain is included as a nested lightweight summary.
 */
public record AssessmentTemplateResponse(
        UUID id,
        String code,
        String name,
        String description,
        String assessmentType,
        Long domainId,
        String domainName,
        Integer durationMinutes,
        Integer totalQuestions,
        boolean active,
        Instant createdAt
) {
    public static AssessmentTemplateResponse from(AssessmentTemplate t) {
        return new AssessmentTemplateResponse(
                t.getId(),
                t.getCode(),
                t.getName(),
                t.getDescription(),
                t.getAssessmentType(),
                t.getDomain().getId(),
                t.getDomain().getName(),
                t.getDurationMinutes(),
                t.getTotalQuestions(),
                t.isActive(),
                t.getCreatedAt()
        );
    }
}
