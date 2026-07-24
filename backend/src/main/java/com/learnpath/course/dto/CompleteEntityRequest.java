package com.learnpath.course.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/** Request DTO for recording a completion event. */
public record CompleteEntityRequest(
        @NotBlank(message = "Entity type is required (LESSON, MODULE, COURSE)")
        String entityType,

        @NotNull(message = "Entity ID is required")
        Long entityId
) {}
