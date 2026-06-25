package com.learnpath.analytics.service;

import com.learnpath.analytics.entity.AnalyticsInsight;
import com.learnpath.analytics.entity.AnalyticsSnapshot;
import com.learnpath.analytics.entity.AnalyticsTrend;
import com.learnpath.analytics.entity.LearningStreak;
import com.learnpath.analytics.repository.AnalyticsInsightRepository;
import com.learnpath.analytics.repository.AnalyticsSnapshotRepository;
import com.learnpath.analytics.repository.LearningStreakRepository;
import com.learnpath.mentor.repository.MentorProfileRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class AnalyticsInsightGenerator {

    private static final Logger log = LoggerFactory.getLogger(AnalyticsInsightGenerator.class);

    private final AnalyticsInsightRepository insightRepository;
    private final AnalyticsSnapshotRepository snapshotRepository;
    private final LearningStreakRepository streakRepository;
    private final MentorProfileRepository mentorProfileRepository;

    public AnalyticsInsightGenerator(
            AnalyticsInsightRepository insightRepository,
            AnalyticsSnapshotRepository snapshotRepository,
            LearningStreakRepository streakRepository,
            MentorProfileRepository mentorProfileRepository) {
        this.insightRepository = insightRepository;
        this.snapshotRepository = snapshotRepository;
        this.streakRepository = streakRepository;
        this.mentorProfileRepository = mentorProfileRepository;
    }

    @Transactional
    public List<AnalyticsInsight> generateInsights(UUID userId, List<AnalyticsTrend> trends) {
        log.info("Generating insights for user: {}", userId);
        Optional<AnalyticsSnapshot> latestOpt = snapshotRepository.findFirstByUserIdOrderBySnapshotTimeDesc(userId);
        if (latestOpt.isEmpty()) {
            return List.of();
        }
        AnalyticsSnapshot latest = latestOpt.get();
        UUID snapshotId = latest.getId();

        List<AnalyticsInsight> newInsights = new ArrayList<>();

        // 1. Low Activity Warning
        Optional<LearningStreak> streakOpt = streakRepository.findByUserId(userId);
        if (streakOpt.isPresent() && streakOpt.get().getCurrentStreak() == 0) {
            addIfNotExists(newInsights, new AnalyticsInsight(
                    userId, "LOW_ACTIVITY", "Low Activity Warning",
                    "You have no active learning streak. Start a session today to build your streak!",
                    "HIGH", null, snapshotId
            ));
        }

        // 2. Streak Milestone
        if (streakOpt.isPresent() && streakOpt.get().getCurrentStreak() > 0 && streakOpt.get().getCurrentStreak() % 5 == 0) {
            addIfNotExists(newInsights, new AnalyticsInsight(
                    userId, "STREAK_MILESTONE", "Streak Milestone Reached",
                    "Congratulations! You have maintained a " + streakOpt.get().getCurrentStreak() + "-day learning streak.",
                    "MEDIUM", null, snapshotId
            ));
        }

        // 3. Strong Placement Readiness
        if (latest.getReadinessScore().compareTo(new BigDecimal("75.00")) >= 0) {
            addIfNotExists(newInsights, new AnalyticsInsight(
                    userId, "STRONG_READINESS", "Strong Placement Readiness",
                    "Your placement readiness score is outstanding (" + latest.getReadinessScore() + "%). You are well-prepared for interviews.",
                    "HIGH", null, snapshotId
            ));
        }

        // 4. High Mentor Engagement
        if (mentorProfileRepository.existsByUserId(userId)) {
            addIfNotExists(newInsights, new AnalyticsInsight(
                    userId, "HIGH_MENTOR_ENGAGEMENT", "Active Mentor Profile",
                    "Your mentor profile is set up. Keep checking mentor suggestions to target key skills.",
                    "MEDIUM", null, snapshotId
            ));
        }

        // 5. XP Growth / Milestone
        if (latest.getTotalXp() >= 500) {
            addIfNotExists(newInsights, new AnalyticsInsight(
                    userId, "XP_MILESTONE", "XP Milestone",
                    "You have accumulated " + latest.getTotalXp() + " total XP. Excellent learning progress!",
                    "MEDIUM", null, snapshotId
            ));
        }

        // 6. Trend-based insights
        for (AnalyticsTrend trend : trends) {
            if ("assessment_average".equals(trend.getMetricName())) {
                if ("UP".equals(trend.getTrendDirection()) && trend.getImprovementPercent().compareTo(new BigDecimal("10.00")) >= 0) {
                    addIfNotExists(newInsights, new AnalyticsInsight(
                            userId, "EXCELLENT_ASSESSMENT_IMPROVEMENT", "Excellent Assessment Improvement",
                            "Your assessment average score has improved by " + trend.getImprovementPercent() + "% since your last snapshot.",
                            "HIGH", null, snapshotId
                    ));
                }
            } else if ("roadmap_completion".equals(trend.getMetricName())) {
                if ("STABLE".equals(trend.getTrendDirection()) && trend.getCurrentValue().compareTo(new BigDecimal("100.00")) < 0) {
                    addIfNotExists(newInsights, new AnalyticsInsight(
                            userId, "ROADMAP_PROGRESS_SLOWING", "Roadmap Progress Slowing",
                            "Your roadmap completion is stable at " + trend.getCurrentValue() + "%. Consider taking the next roadmap nodes.",
                            "MEDIUM", null, snapshotId
                    ));
                }
            }
        }

        return insightRepository.saveAll(newInsights);
    }

    private void addIfNotExists(List<AnalyticsInsight> list, AnalyticsInsight insight) {
        if (!insightRepository.existsByUserIdAndInsightTypeAndSnapshotId(
                insight.getUserId(), insight.getInsightType(), insight.getSnapshotId())) {
            list.add(insight);
        }
    }
}
