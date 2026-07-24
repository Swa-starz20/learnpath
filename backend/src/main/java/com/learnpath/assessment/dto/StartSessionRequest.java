package com.learnpath.assessment.dto;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

/**
 * Request DTO for starting a new assessment session.
 */
public record StartSessionRequest(
        @NotNull(message = "Template ID is required")
        UUID templateId
) {}
