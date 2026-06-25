package com.learnpath.placement.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreatePlacementTargetRequest(
        @NotNull(message = "Domain ID is required")
        Long domainId,

        @NotBlank(message = "Company name is required")
        @Size(max = 255, message = "Company name cannot exceed 255 characters")
        String companyName,

        @NotBlank(message = "Role name is required")
        @Size(max = 255, message = "Role name cannot exceed 255 characters")
        String roleName,

        @Min(value = 1, message = "Priority must be at least 1")
        @Max(value = 100, message = "Priority cannot exceed 100")
        Integer priority
) {}
