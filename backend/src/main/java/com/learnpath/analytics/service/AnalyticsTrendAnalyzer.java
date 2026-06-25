package com.learnpath.analytics.service;

import com.learnpath.analytics.entity.AnalyticsSnapshot;
import com.learnpath.analytics.entity.AnalyticsTrend;
import com.learnpath.analytics.repository.AnalyticsSnapshotRepository;
import com.learnpath.analytics.repository.AnalyticsTrendRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class AnalyticsTrendAnalyzer {

    private static final Logger log = LoggerFactory.getLogger(AnalyticsTrendAnalyzer.class);

    private final AnalyticsSnapshotRepository snapshotRepository;
    private final AnalyticsTrendRepository trendRepository;

    public AnalyticsTrendAnalyzer(AnalyticsSnapshotRepository snapshotRepository,
                                  AnalyticsTrendRepository trendRepository) {
        this.snapshotRepository = snapshotRepository;
        this.trendRepository = trendRepository;
    }

    @Transactional
    public List<AnalyticsTrend> analyzeTrends(UUID userId) {
        log.info("Analyzing trends for user: {}", userId);
        List<AnalyticsSnapshot> snapshots = snapshotRepository.findByUserIdOrderBySnapshotTimeDesc(userId);

        if (snapshots.isEmpty()) {
            log.warn("No snapshots found for user {}, skipping trend analysis", userId);
            return List.of();
        }

        AnalyticsSnapshot latest = snapshots.get(0);
        AnalyticsSnapshot previous = snapshots.size() > 1 ? snapshots.get(1) : null;

        List<AnalyticsTrend> trends = new ArrayList<>();

        trends.add(calculateMetricTrend(userId, "roadmap_completion",
                previous != null ? previous.getRoadmapCompletion() : BigDecimal.ZERO,
                latest.getRoadmapCompletion()));

        trends.add(calculateMetricTrend(userId, "assessment_average",
                previous != null ? previous.getAssessmentAverage() : BigDecimal.ZERO,
                latest.getAssessmentAverage()));

        trends.add(calculateMetricTrend(userId, "total_xp",
                previous != null ? BigDecimal.valueOf(previous.getTotalXp()) : BigDecimal.ZERO,
                BigDecimal.valueOf(latest.getTotalXp())));

        trends.add(calculateMetricTrend(userId, "mastery_score",
                previous != null ? previous.getMasteryScore() : BigDecimal.ZERO,
                latest.getMasteryScore()));

        trends.add(calculateMetricTrend(userId, "readiness_score",
                previous != null ? previous.getReadinessScore() : BigDecimal.ZERO,
                latest.getReadinessScore()));

        return trendRepository.saveAll(trends);
    }

    private AnalyticsTrend calculateMetricTrend(UUID userId, String metricName, BigDecimal prev, BigDecimal curr) {
        String direction;
        BigDecimal improvement;

        int compare = curr.compareTo(prev);
        if (compare > 0) {
            direction = "UP";
        } else if (compare < 0) {
            direction = "DOWN";
        } else {
            direction = "STABLE";
        }

        if (prev.compareTo(BigDecimal.ZERO) == 0) {
            if (curr.compareTo(BigDecimal.ZERO) == 0) {
                improvement = BigDecimal.ZERO;
            } else {
                improvement = new BigDecimal("100.00");
            }
        } else {
            improvement = curr.subtract(prev)
                    .multiply(new BigDecimal("100.00"))
                    .divide(prev, 2, RoundingMode.HALF_UP);
        }

        return new AnalyticsTrend(userId, metricName, prev, curr, direction, improvement);
    }
}
