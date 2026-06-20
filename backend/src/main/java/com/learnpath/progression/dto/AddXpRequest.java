package com.learnpath.progression.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

/** Request DTO for adding XP to a user's progression record. */
public record AddXpRequest(
        @NotNull(message = "XP amount is required")
        @Min(value = 1, message = "XP amount must be at least 1")
        Integer amount,

        String reason
) {}
