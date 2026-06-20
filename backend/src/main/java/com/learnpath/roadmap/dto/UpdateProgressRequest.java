package com.learnpath.roadmap.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/** Request DTO for updating progress on a roadmap node. */
public record UpdateProgressRequest(
        @NotNull(message = "Node ID is required")
        Long nodeId,

        @NotBlank(message = "Status is required")
        String status
) {}
