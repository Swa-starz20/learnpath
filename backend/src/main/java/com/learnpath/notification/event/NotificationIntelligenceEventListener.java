package com.learnpath.notification.event;

import com.learnpath.analytics.event.AnalyticsGeneratedEvent;
import com.learnpath.assessment.event.AssessmentCompletedEvent;
import com.learnpath.notification.service.NotificationIntelligenceService;
import com.learnpath.roadmap.repository.UserRoadmapProgressRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
public class NotificationIntelligenceEventListener {

    private static final Logger log = LoggerFactory.getLogger(NotificationIntelligenceEventListener.class);

    private final NotificationIntelligenceService notificationIntelligenceService;
    private final UserRoadmapProgressRepository roadmapProgressRepository;

    public NotificationIntelligenceEventListener(
            NotificationIntelligenceService notificationIntelligenceService,
            UserRoadmapProgressRepository roadmapProgressRepository) {
        this.notificationIntelligenceService = notificationIntelligenceService;
        this.roadmapProgressRepository = roadmapProgressRepository;
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void onAssessmentCompleted(AssessmentCompletedEvent event) {
        log.info("Notification Intelligence processing AssessmentCompletedEvent for user: {}", event.userId());

        // 1. assessment completed (ASSESSMENT)
        notificationIntelligenceService.processEventNotification(
                event.userId(),
                "ASSESSMENT",
                "Assessment Completed",
                "You have successfully completed the assessment with an overall score of " + event.overallScore() + "%.",
                "MEDIUM",
                "/api/v1/assessments/results/" + event.resultId()
        );

        // 2. score available (ASSESSMENT)
        notificationIntelligenceService.processEventNotification(
                event.userId(),
                "ASSESSMENT",
                "Assessment Score Available",
                "Your score of " + event.overallScore() + "% is now available for review.",
                "MEDIUM",
                "/api/v1/assessments/results/" + event.resultId()
        );

        // 3. roadmap unlocked (if applicable) (ROADMAP)
        boolean hasRoadmap = !roadmapProgressRepository.findByUserId(event.userId()).isEmpty();
        if (hasRoadmap) {
            notificationIntelligenceService.processEventNotification(
                    event.userId(),
                    "ROADMAP",
                    "Learning Roadmap Unlocked",
                    "Based on your latest assessment, a new learning roadmap has been unlocked.",
                    "HIGH",
                    "/api/v1/roadmaps"
            );
        }

        // 4. mentor insights available (MENTOR)
        notificationIntelligenceService.processEventNotification(
                event.userId(),
                "MENTOR",
                "Mentor Insights Available",
                "New personalized AI mentor insights are available based on your performance.",
                "MEDIUM",
                "/api/v1/mentor/insights"
        );

        // 5. recommendations available (MENTOR)
        notificationIntelligenceService.processEventNotification(
                event.userId(),
                "MENTOR",
                "AI Recommendations Available",
                "New recommendations are available to guide your learning path.",
                "MEDIUM",
                "/api/v1/mentor/recommendations"
        );

        // 6. readiness updated (PLACEMENT)
        notificationIntelligenceService.processEventNotification(
                event.userId(),
                "PLACEMENT",
                "Placement Readiness Updated",
                "Your placement readiness metrics have been updated.",
                "HIGH",
                "/api/v1/placement/readiness"
        );

        // 7. company fit updated (PLACEMENT)
        notificationIntelligenceService.processEventNotification(
                event.userId(),
                "PLACEMENT",
                "Company Fit Updated",
                "Your compatibility with target companies has been re-evaluated.",
                "MEDIUM",
                "/api/v1/placement/fit"
        );

        // 8. skill gap identified (PLACEMENT)
        notificationIntelligenceService.processEventNotification(
                event.userId(),
                "PLACEMENT",
                "Skill Gap Identified",
                "Key skill gaps have been identified for your target career track.",
                "MEDIUM",
                "/api/v1/placement/skills"
        );
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void onAnalyticsGenerated(AnalyticsGeneratedEvent event) {
        log.info("Notification Intelligence processing AnalyticsGeneratedEvent for user: {}", event.userId());

        // 1. analytics refreshed (ANALYTICS)
        notificationIntelligenceService.processEventNotification(
                event.userId(),
                "ANALYTICS",
                "Analytics Refreshed",
                "Your student analytics dashboard snapshot has been successfully refreshed.",
                "LOW",
                "/api/v1/analytics/snapshot/" + event.snapshotId()
        );

        // 2. progress improved (ANALYTICS)
        notificationIntelligenceService.processEventNotification(
                event.userId(),
                "ANALYTICS",
                "Progress Improved",
                "Congratulations! Your learning velocity and completion rates show positive progress.",
                "MEDIUM",
                "/api/v1/analytics/trends"
        );

        // 3. prediction available (ANALYTICS)
        notificationIntelligenceService.processEventNotification(
                event.userId(),
                "ANALYTICS",
                "Performance Prediction Available",
                "AI performance predictions are now available on your dashboard.",
                "MEDIUM",
                "/api/v1/analytics/predictions"
        );

        // 4. streak milestone (ANALYTICS)
        notificationIntelligenceService.processEventNotification(
                event.userId(),
                "ANALYTICS",
                "Streak Milestone",
                "You are maintaining your study streak! Keep learning to build your streak.",
                "HIGH",
                "/api/v1/analytics/streak"
        );
    }
}
