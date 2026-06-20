package com.learnpath.skill.dto;

import jakarta.validation.constraints.NotNull;

/** Request DTO for assigning a skill to the current user. */
public record AssignSkillRequest(
        @NotNull(message = "Skill ID is required")
        Long skillId
) {}
