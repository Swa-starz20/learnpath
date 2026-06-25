package com.learnpath.analytics.service;

import com.learnpath.analytics.entity.AnalyticsInsight;
import com.learnpath.analytics.entity.AnalyticsSnapshot;
import com.learnpath.analytics.entity.AnalyticsTrend;
import com.learnpath.analytics.entity.LearningStreak;
import com.learnpath.analytics.repository.AnalyticsInsightRepository;
import com.learnpath.analytics.repository.AnalyticsSnapshotRepository;
import com.learnpath.analytics.repository.LearningStreakRepository;
import com.learnpath.mentor.repository.MentorProfileRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

class AnalyticsInsightGeneratorTest {

    private AnalyticsInsightRepository insightRepository;
    private AnalyticsSnapshotRepository snapshotRepository;
    private LearningStreakRepository streakRepository;
    private MentorProfileRepository mentorProfileRepository;
    private AnalyticsInsightGenerator insightGenerator;

    @BeforeEach
    void setUp() {
        insightRepository = Mockito.mock(AnalyticsInsightRepository.class);
        snapshotRepository = Mockito.mock(AnalyticsSnapshotRepository.class);
        streakRepository = Mockito.mock(LearningStreakRepository.class);
        mentorProfileRepository = Mockito.mock(MentorProfileRepository.class);
        insightGenerator = new AnalyticsInsightGenerator(insightRepository, snapshotRepository, streakRepository, mentorProfileRepository);

        when(insightRepository.saveAll(anyList())).thenAnswer(invocation -> invocation.getArgument(0));
        when(insightRepository.existsByUserIdAndInsightTypeAndSnapshotId(any(), anyString(), any())).thenReturn(false);
    }

    @Test
    void generateInsights_noSnapshot_returnsEmpty() {
        UUID userId = UUID.randomUUID();
        when(snapshotRepository.findFirstByUserIdOrderBySnapshotTimeDesc(userId)).thenReturn(Optional.empty());

        List<AnalyticsInsight> insights = insightGenerator.generateInsights(userId, List.of());
        assertTrue(insights.isEmpty());
    }

    @Test
    void generateInsights_triggersInsightsCorrectly() {
        UUID userId = UUID.randomUUID();
        AnalyticsSnapshot latest = new AnalyticsSnapshot(
                userId,
                BigDecimal.valueOf(50.00),
                BigDecimal.valueOf(60.00),
                BigDecimal.valueOf(70.00),
                BigDecimal.valueOf(80.00), // readiness score >= 75%
                550, // total XP >= 500
                BigDecimal.valueOf(90.00)
        );
        latest.setId(UUID.randomUUID());

        when(snapshotRepository.findFirstByUserIdOrderBySnapshotTimeDesc(userId)).thenReturn(Optional.of(latest));
        when(streakRepository.findByUserId(userId)).thenReturn(Optional.of(new LearningStreak(userId, 0, 0, LocalDate.now())));
        when(mentorProfileRepository.existsByUserId(userId)).thenReturn(true);

        List<AnalyticsTrend> trends = List.of(
                new AnalyticsTrend(userId, "assessment_average", BigDecimal.valueOf(50.00), BigDecimal.valueOf(70.00), "UP", BigDecimal.valueOf(40.00))
        );

        List<AnalyticsInsight> insights = insightGenerator.generateInsights(userId, trends);
        assertFalse(insights.isEmpty());

        assertTrue(hasInsight(insights, "LOW_ACTIVITY"));
        assertTrue(hasInsight(insights, "STRONG_READINESS"));
        assertTrue(hasInsight(insights, "HIGH_MENTOR_ENGAGEMENT"));
        assertTrue(hasInsight(insights, "XP_MILESTONE"));
        assertTrue(hasInsight(insights, "EXCELLENT_ASSESSMENT_IMPROVEMENT"));
    }

    private boolean hasInsight(List<AnalyticsInsight> insights, String type) {
        return insights.stream().anyMatch(i -> i.getInsightType().equals(type));
    }
}
