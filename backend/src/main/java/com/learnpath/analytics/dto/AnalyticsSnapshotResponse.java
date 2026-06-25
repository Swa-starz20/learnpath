package com.learnpath.analytics.dto;

import com.learnpath.analytics.entity.AnalyticsSnapshot;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record AnalyticsSnapshotResponse(
        UUID id,
        UUID userId,
        BigDecimal overallProgress,
        BigDecimal roadmapCompletion,
        BigDecimal assessmentAverage,
        BigDecimal readinessScore,
        Integer totalXp,
        BigDecimal masteryScore,
        Instant snapshotTime
) {
    public static AnalyticsSnapshotResponse from(AnalyticsSnapshot snapshot) {
        if (snapshot == null) return null;
        return new AnalyticsSnapshotResponse(
                snapshot.getId(),
                snapshot.getUserId(),
                snapshot.getOverallProgress(),
                snapshot.getRoadmapCompletion(),
                snapshot.getAssessmentAverage(),
                snapshot.getReadinessScore(),
                snapshot.getTotalXp(),
                snapshot.getMasteryScore(),
                snapshot.getSnapshotTime()
        );
    }
}
