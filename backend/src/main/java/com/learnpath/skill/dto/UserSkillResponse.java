package com.learnpath.skill.dto;

import com.learnpath.skill.entity.UserSkill;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

/** Read-only view of a {@link com.learnpath.skill.entity.UserSkill}. */
public record UserSkillResponse(
        Long id,
        UUID userId,
        SkillResponse skill,
        BigDecimal confidenceScore,
        String masteryLevel,
        Instant lastAssessedAt,
        Instant createdAt
) {
    public static UserSkillResponse from(UserSkill us) {
        return new UserSkillResponse(
                us.getId(),
                us.getUserId(),
                SkillResponse.from(us.getSkill()),
                us.getConfidenceScore(),
                us.getMasteryLevel(),
                us.getLastAssessedAt(),
                us.getCreatedAt()
        );
    }
}
