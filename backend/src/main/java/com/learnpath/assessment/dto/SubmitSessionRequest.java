package com.learnpath.assessment.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

/**
 * Request DTO for submitting (completing) an assessment session.
 */
public record SubmitSessionRequest(
        @NotNull(message = "Time spent is required")
        @Min(value = 0, message = "Time spent must be non-negative")
        Integer timeSpentSeconds
) {}
