package com.learnpath.scheduler;

import com.learnpath.analytics.service.AnalyticsIntelligenceService;
import com.learnpath.analytics.service.AnalyticsService;
import com.learnpath.assessment.entity.AssessmentResult;
import com.learnpath.assessment.repository.AssessmentResultRepository;
import com.learnpath.mentor.entity.MentorProfile;
import com.learnpath.mentor.repository.MentorProfileRepository;
import com.learnpath.mentor.service.MentorIntelligenceService;
import com.learnpath.notification.service.NotificationService;
import com.learnpath.placement.entity.PlacementProfile;
import com.learnpath.placement.repository.PlacementProfileRepository;
import com.learnpath.placement.service.PlacementIntelligenceService;
import com.learnpath.user.entity.User;
import com.learnpath.user.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
@EnableScheduling
public class PlatformScheduler {

    private static final Logger log = LoggerFactory.getLogger(PlatformScheduler.class);

    private final UserRepository userRepository;
    private final AssessmentResultRepository assessmentResultRepository;
    private final PlacementProfileRepository placementProfileRepository;
    private final MentorProfileRepository mentorProfileRepository;
    private final AnalyticsService analyticsService;
    private final AnalyticsIntelligenceService analyticsIntelligenceService;
    private final PlacementIntelligenceService placementIntelligenceService;
    private final MentorIntelligenceService mentorIntelligenceService;
    private final NotificationService notificationService;

    public PlatformScheduler(
            UserRepository userRepository,
            AssessmentResultRepository assessmentResultRepository,
            PlacementProfileRepository placementProfileRepository,
            MentorProfileRepository mentorProfileRepository,
            AnalyticsService analyticsService,
            AnalyticsIntelligenceService analyticsIntelligenceService,
            PlacementIntelligenceService placementIntelligenceService,
            MentorIntelligenceService mentorIntelligenceService,
            NotificationService notificationService) {
        this.userRepository = userRepository;
        this.assessmentResultRepository = assessmentResultRepository;
        this.placementProfileRepository = placementProfileRepository;
        this.mentorProfileRepository = mentorProfileRepository;
        this.analyticsService = analyticsService;
        this.analyticsIntelligenceService = analyticsIntelligenceService;
        this.placementIntelligenceService = placementIntelligenceService;
        this.mentorIntelligenceService = mentorIntelligenceService;
        this.notificationService = notificationService;
    }

    /**
     * Daily Analytics Snapshot at 2:00 AM.
     */
    @Scheduled(cron = "0 0 2 * * ?")
    @Transactional
    public void runDailyAnalyticsSnapshot() {
        log.info("Starting scheduled job: Daily Analytics Snapshot");
        List<User> users = userRepository.findAll();
        for (User user : users) {
            try {
                analyticsService.calculateAndSaveSnapshot(user.getId());
            } catch (Exception e) {
                log.error("Failed to calculate analytics snapshot for user: {}", user.getId(), e);
            }
        }
        log.info("Completed scheduled job: Daily Analytics Snapshot");
    }

    /**
     * Daily Placement Readiness Refresh at 2:30 AM.
     */
    @Scheduled(cron = "0 30 2 * * ?")
    @Transactional
    public void runDailyPlacementReadinessRefresh() {
        log.info("Starting scheduled job: Daily Placement Readiness Refresh");
        List<PlacementProfile> profiles = placementProfileRepository.findAll();
        for (PlacementProfile profile : profiles) {
            try {
                List<AssessmentResult> results = assessmentResultRepository.findByUserIdOrderByCompletedAtDesc(profile.getUserId());
                if (!results.isEmpty()) {
                    placementIntelligenceService.processAssessmentCompletion(profile.getUserId(), results.get(0).getId());
                }
            } catch (Exception e) {
                log.error("Failed to refresh placement readiness for user: {}", profile.getUserId(), e);
            }
        }
        log.info("Completed scheduled job: Daily Placement Readiness Refresh");
    }

    /**
     * Weekly Mentor Refresh every Sunday at 3:00 AM.
     */
    @Scheduled(cron = "0 0 3 * * SUN")
    @Transactional
    public void runWeeklyMentorRefresh() {
        log.info("Starting scheduled job: Weekly Mentor Refresh");
        List<MentorProfile> profiles = mentorProfileRepository.findAll();
        for (MentorProfile profile : profiles) {
            try {
                List<AssessmentResult> results = assessmentResultRepository.findByUserIdOrderByCompletedAtDesc(profile.getUserId());
                if (!results.isEmpty()) {
                    mentorIntelligenceService.processAssessmentCompletion(profile.getUserId(), results.get(0).getId());
                }
            } catch (Exception e) {
                log.error("Failed to refresh mentor insights for user: {}", profile.getUserId(), e);
            }
        }
        log.info("Completed scheduled job: Weekly Mentor Refresh");
    }

    /**
     * Weekly Analytics Intelligence Refresh every Sunday at 3:30 AM.
     */
    @Scheduled(cron = "0 30 3 * * SUN")
    @Transactional
    public void runWeeklyAnalyticsIntelligenceRefresh() {
        log.info("Starting scheduled job: Weekly Analytics Intelligence Refresh");
        List<User> users = userRepository.findAll();
        for (User user : users) {
            try {
                analyticsIntelligenceService.processAnalyticsIntelligence(user.getId());
            } catch (Exception e) {
                log.error("Failed to refresh analytics intelligence for user: {}", user.getId(), e);
            }
        }
        log.info("Completed scheduled job: Weekly Analytics Intelligence Refresh");
    }

    /**
     * Weekly Notification Cleanup every Sunday at 4:00 AM.
     */
    @Scheduled(cron = "0 0 4 * * SUN")
    public void runWeeklyNotificationCleanup() {
        log.info("Starting scheduled job: Weekly Notification Cleanup");
        try {
            notificationService.cleanupNotifications();
        } catch (Exception e) {
            log.error("Failed to perform notification cleanup", e);
        }
        log.info("Completed scheduled job: Weekly Notification Cleanup");
    }

    /**
     * Monthly Snapshot Cleanup on the 1st of every month at 4:30 AM.
     */
    @Scheduled(cron = "0 30 4 1 * ?")
    public void runMonthlySnapshotCleanup() {
        log.info("Starting scheduled job: Monthly Snapshot Cleanup");
        try {
            analyticsService.cleanupSnapshots();
        } catch (Exception e) {
            log.error("Failed to perform snapshot cleanup", e);
        }
        log.info("Completed scheduled job: Monthly Snapshot Cleanup");
    }
}
