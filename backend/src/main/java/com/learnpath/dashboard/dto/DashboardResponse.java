package com.learnpath.dashboard.dto;

import com.learnpath.analytics.dto.ActivityLogResponse;
import com.learnpath.analytics.dto.AnalyticsSnapshotResponse;
import com.learnpath.analytics.dto.LearningStreakResponse;
import com.learnpath.assessment.dto.AssessmentResultResponse;
import com.learnpath.mentor.dto.MentorInsightResponse;
import com.learnpath.mentor.dto.MentorRecommendationResponse;
import com.learnpath.notification.dto.NotificationResponse;
import com.learnpath.placement.dto.PlacementReadinessResponse;
import com.learnpath.placement.dto.PlacementRecommendationResponse;
import com.learnpath.roadmap.dto.UserProgressResponse;
import com.learnpath.user.dto.UserResponse;

import java.math.BigDecimal;
import java.util.List;

public record DashboardResponse(
        UserResponse profile,
        Integer xp,
        BigDecimal masteryScore,
        String currentLevel,
        AssessmentSummary assessmentSummary,
        PlacementReadinessResponse placementReadiness,
        List<UserProgressResponse> currentRoadmapProgress,
        BigDecimal roadmapCompletion,
        List<MentorInsightResponse> activeMentorInsights,
        List<PlacementRecommendationResponse> activePlacementRecommendations,
        AnalyticsSnapshotResponse analyticsSnapshot,
        LearningStreakResponse learningStreak,
        long unreadNotificationCount,
        List<NotificationResponse> latestNotifications,
        List<ActivityLogResponse> recentActivity
) {
    public record AssessmentSummary(
            BigDecimal latestAssessmentScore,
            BigDecimal assessmentAverage
    ) {}
}
