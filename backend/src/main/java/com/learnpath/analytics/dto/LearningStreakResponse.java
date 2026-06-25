package com.learnpath.analytics.dto;

import com.learnpath.analytics.entity.LearningStreak;
import java.time.LocalDate;
import java.util.UUID;

public record LearningStreakResponse(
        UUID id,
        UUID userId,
        Integer currentStreak,
        Integer longestStreak,
        LocalDate lastActivityDate
) {
    public static LearningStreakResponse from(LearningStreak streak) {
        if (streak == null) return null;
        return new LearningStreakResponse(
                streak.getId(),
                streak.getUserId(),
                streak.getCurrentStreak(),
                streak.getLongestStreak(),
                streak.getLastActivityDate()
        );
    }
}
