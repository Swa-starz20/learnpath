package com.learnpath.dashboard.service;

import com.learnpath.analytics.dto.ActivityLogResponse;
import com.learnpath.analytics.dto.AnalyticsSnapshotResponse;
import com.learnpath.analytics.dto.LearningStreakResponse;
import com.learnpath.analytics.service.AnalyticsService;
import com.learnpath.assessment.dto.AssessmentResultResponse;
import com.learnpath.assessment.service.AssessmentService;
import com.learnpath.dashboard.dto.DashboardResponse;
import com.learnpath.mentor.dto.MentorInsightResponse;
import com.learnpath.mentor.dto.MentorProfileResponse;
import com.learnpath.mentor.dto.MentorRecommendationResponse;
import com.learnpath.mentor.service.MentorService;
import com.learnpath.notification.dto.NotificationResponse;
import com.learnpath.notification.service.NotificationService;
import com.learnpath.placement.dto.PlacementReadinessResponse;
import com.learnpath.placement.dto.PlacementRecommendationResponse;
import com.learnpath.placement.entity.PlacementProfile;
import com.learnpath.placement.repository.PlacementProfileRepository;
import com.learnpath.placement.service.PlacementService;
import com.learnpath.progression.dto.ProgressionResponse;
import com.learnpath.progression.service.ProgressionService;
import com.learnpath.roadmap.dto.UserProgressResponse;
import com.learnpath.roadmap.repository.UserRoadmapProgressRepository;
import com.learnpath.user.dto.UserResponse;
import com.learnpath.user.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

@Service
public class DashboardService {

    private static final Logger log = LoggerFactory.getLogger(DashboardService.class);

    private final UserService userService;
    private final ProgressionService progressionService;
    private final AssessmentService assessmentService;
    private final PlacementService placementService;
    private final MentorService mentorService;
    private final AnalyticsService analyticsService;
    private final NotificationService notificationService;
    private final UserRoadmapProgressRepository roadmapProgressRepository;
    private final PlacementProfileRepository placementProfileRepository;

    public DashboardService(
            UserService userService,
            ProgressionService progressionService,
            AssessmentService assessmentService,
            PlacementService placementService,
            MentorService mentorService,
            AnalyticsService analyticsService,
            NotificationService notificationService,
            UserRoadmapProgressRepository roadmapProgressRepository,
            PlacementProfileRepository placementProfileRepository) {
        this.userService = userService;
        this.progressionService = progressionService;
        this.assessmentService = assessmentService;
        this.placementService = placementService;
        this.mentorService = mentorService;
        this.analyticsService = analyticsService;
        this.notificationService = notificationService;
        this.roadmapProgressRepository = roadmapProgressRepository;
        this.placementProfileRepository = placementProfileRepository;
    }

    public DashboardResponse getDashboard(UUID userId) {
        log.info("Aggregating dashboard data for user: {}", userId);

        // 1. User profile
        UserResponse profile = null;
        try {
            profile = userService.getUserById(userId);
        } catch (Exception e) {
            log.warn("Could not load user profile for user: {}", userId, e);
        }

        // 2. Progression
        Integer xp = 0;
        BigDecimal masteryScore = BigDecimal.ZERO;
        try {
            ProgressionResponse progression = progressionService.getOrCreateProgression(userId);
            if (progression != null) {
                xp = progression.totalXp();
                masteryScore = progression.masteryScore();
            }
        } catch (Exception e) {
            log.warn("Could not load progression for user: {}", userId, e);
        }

        // 3. Current Level (from MentorProfile)
        String currentLevel = null;
        try {
            MentorProfileResponse mentorProfile = mentorService.getProfile(userId);
            if (mentorProfile != null) {
                currentLevel = mentorProfile.currentLevel();
            }
        } catch (Exception e) {
            log.info("No mentor profile exists yet for user: {}", userId);
        }

        // 4. Assessment Summary
        BigDecimal latestAssessmentScore = null;
        BigDecimal assessmentAverage = BigDecimal.ZERO;
        try {
            List<AssessmentResultResponse> results = assessmentService.getMyResults(userId);
            if (results != null && !results.isEmpty()) {
                latestAssessmentScore = results.get(0).scorePercentage();
                BigDecimal sum = BigDecimal.ZERO;
                for (AssessmentResultResponse r : results) {
                    sum = sum.add(r.scorePercentage());
                }
                assessmentAverage = sum.divide(BigDecimal.valueOf(results.size()), 2, java.math.RoundingMode.HALF_UP);
            }
        } catch (Exception e) {
            log.warn("Could not load assessment results for user: {}", userId, e);
        }
        DashboardResponse.AssessmentSummary assessmentSummary = new DashboardResponse.AssessmentSummary(
                latestAssessmentScore,
                assessmentAverage
        );

        // 5. Placement Readiness & Recommendations
        PlacementReadinessResponse placementReadiness = null;
        List<PlacementRecommendationResponse> activePlacementRecommendations = Collections.emptyList();
        try {
            List<PlacementProfile> placementProfiles = placementProfileRepository.findByUserId(userId);
            if (!placementProfiles.isEmpty()) {
                Long domainId = placementProfiles.get(0).getDomainId();
                try {
                    placementReadiness = placementService.getReadiness(userId, domainId);
                } catch (Exception e) {
                    log.info("No placement readiness score calculated yet for user: {}", userId);
                }
                try {
                    activePlacementRecommendations = placementService.listRecommendations(userId, domainId);
                } catch (Exception e) {
                    log.warn("Could not load placement recommendations for user: {}", userId, e);
                }
            }
        } catch (Exception e) {
            log.warn("Could not load placement profile info for user: {}", userId, e);
        }

        // 6. Current Roadmap Progress
        List<UserProgressResponse> currentRoadmapProgress = Collections.emptyList();
        try {
            currentRoadmapProgress = roadmapProgressRepository.findByUserId(userId).stream()
                    .map(UserProgressResponse::from)
                    .toList();
        } catch (Exception e) {
            log.warn("Could not load roadmap progress for user: {}", userId, e);
        }

        // 7. Roadmap Completion & Analytics Snapshot
        BigDecimal roadmapCompletion = BigDecimal.ZERO;
        AnalyticsSnapshotResponse analyticsSnapshot = null;
        try {
            analyticsSnapshot = analyticsService.getLatestSummary(userId);
            if (analyticsSnapshot != null) {
                roadmapCompletion = analyticsSnapshot.roadmapCompletion();
            }
        } catch (Exception e) {
            log.warn("Could not load analytics summary for user: {}", userId, e);
        }

        // 8. Active Mentor Insights & Recommendations
        List<MentorInsightResponse> activeMentorInsights = Collections.emptyList();
        try {
            activeMentorInsights = mentorService.listInsights(userId);
        } catch (Exception e) {
            log.warn("Could not load mentor insights for user: {}", userId, e);
        }

        // 9. Learning Streak
        LearningStreakResponse learningStreak = null;
        try {
            learningStreak = analyticsService.getStreak(userId);
        } catch (Exception e) {
            log.warn("Could not load learning streak for user: {}", userId, e);
        }

        // 10. Unread Notification Count
        long unreadNotificationCount = 0;
        try {
            unreadNotificationCount = notificationService.getUnreadCount(userId);
        } catch (Exception e) {
            log.warn("Could not load unread notification count for user: {}", userId, e);
        }

        // 11. Latest Notifications (limit 5)
        List<NotificationResponse> latestNotifications = Collections.emptyList();
        try {
            Page<NotificationResponse> page = notificationService.getLatestNotifications(userId, 0, 5);
            if (page != null) {
                latestNotifications = page.getContent();
            }
        } catch (Exception e) {
            log.warn("Could not load latest notifications for user: {}", userId, e);
        }

        // 12. Recent Activity
        List<ActivityLogResponse> recentActivity = Collections.emptyList();
        try {
            recentActivity = analyticsService.getActivityHistory(userId);
        } catch (Exception e) {
            log.warn("Could not load activity history for user: {}", userId, e);
        }

        return new DashboardResponse(
                profile,
                xp,
                masteryScore,
                currentLevel,
                assessmentSummary,
                placementReadiness,
                currentRoadmapProgress,
                roadmapCompletion,
                activeMentorInsights,
                activePlacementRecommendations,
                analyticsSnapshot,
                learningStreak,
                unreadNotificationCount,
                latestNotifications,
                recentActivity
        );
    }
}
