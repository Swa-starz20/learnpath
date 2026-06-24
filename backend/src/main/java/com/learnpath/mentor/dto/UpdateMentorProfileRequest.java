package com.learnpath.mentor.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * Request DTO for creating or updating a mentor profile.
 */
public record UpdateMentorProfileRequest(
        @NotNull(message = "Primary domain ID is required")
        Long primaryDomainId,

        @Size(max = 50, message = "Current level cannot exceed 50 characters")
        String currentLevel,

        @Size(max = 200, message = "Target role cannot exceed 200 characters")
        String targetRole
) {}
