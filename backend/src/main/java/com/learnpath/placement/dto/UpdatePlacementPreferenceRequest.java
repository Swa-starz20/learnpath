package com.learnpath.placement.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UpdatePlacementPreferenceRequest(
        @NotNull(message = "Domain ID is required")
        Long domainId,

        Boolean prefersRemote,
        Boolean prefersHybrid,
        Boolean prefersOnsite,

        @Size(max = 50, message = "Preferred company size cannot exceed 50 characters")
        String preferredCompanySize,

        @Size(max = 100, message = "Preferred industry cannot exceed 100 characters")
        String preferredIndustry
) {}
