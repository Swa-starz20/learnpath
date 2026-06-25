package com.learnpath.notification.dto;

import com.learnpath.notification.entity.NotificationPreference;
import java.time.Instant;
import java.util.UUID;

public record NotificationPreferenceResponse(
        UUID id,
        UUID userId,
        boolean assessmentNotifications,
        boolean mentorNotifications,
        boolean placementNotifications,
        boolean analyticsNotifications,
        boolean roadmapNotifications,
        boolean emailEnabled,
        boolean inAppEnabled,
        Instant createdAt,
        Instant updatedAt
) {
    public static NotificationPreferenceResponse from(NotificationPreference pref) {
        if (pref == null) return null;
        return new NotificationPreferenceResponse(
                pref.getId(),
                pref.getUserId(),
                pref.isAssessmentNotifications(),
                pref.isMentorNotifications(),
                pref.isPlacementNotifications(),
                pref.isAnalyticsNotifications(),
                pref.isRoadmapNotifications(),
                pref.isEmailEnabled(),
                pref.isInAppEnabled(),
                pref.getCreatedAt(),
                pref.getUpdatedAt()
        );
    }
}
