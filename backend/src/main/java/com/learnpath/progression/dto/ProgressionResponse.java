package com.learnpath.progression.dto;

import com.learnpath.progression.entity.UserProgression;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

/** Read-only view of a user's progression. */
public record ProgressionResponse(
        Long id,
        UUID userId,
        Integer totalXp,
        BigDecimal masteryScore,
        Integer streakDays,
        Instant lastActivityAt,
        Instant updatedAt
) {
    public static ProgressionResponse from(UserProgression p) {
        return new ProgressionResponse(
                p.getId(),
                p.getUserId(),
                p.getTotalXp(),
                p.getMasteryScore(),
                p.getStreakDays(),
                p.getLastActivityAt(),
                p.getUpdatedAt()
        );
    }
}
