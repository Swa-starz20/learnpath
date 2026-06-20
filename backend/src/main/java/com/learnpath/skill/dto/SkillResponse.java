package com.learnpath.skill.dto;

import com.learnpath.skill.entity.Skill;

import java.time.Instant;

/** Read-only view of a {@link Skill}. */
public record SkillResponse(
        Long id,
        Long domainId,
        String domainCode,
        String name,
        String description,
        String category,
        Instant createdAt
) {
    public static SkillResponse from(Skill skill) {
        return new SkillResponse(
                skill.getId(),
                skill.getDomain().getId(),
                skill.getDomain().getCode(),
                skill.getName(),
                skill.getDescription(),
                skill.getCategory(),
                skill.getCreatedAt()
        );
    }
}
