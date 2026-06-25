package com.learnpath.notification.dto;

import jakarta.validation.constraints.NotNull;

public record UpdateNotificationPreferenceRequest(
        @NotNull(message = "Assessment notifications flag is required")
        Boolean assessmentNotifications,

        @NotNull(message = "Mentor notifications flag is required")
        Boolean mentorNotifications,

        @NotNull(message = "Placement notifications flag is required")
        Boolean placementNotifications,

        @NotNull(message = "Analytics notifications flag is required")
        Boolean analyticsNotifications,

        @NotNull(message = "Roadmap notifications flag is required")
        Boolean roadmapNotifications,

        @NotNull(message = "Email enabled flag is required")
        Boolean emailEnabled,

        @NotNull(message = "In app enabled flag is required")
        Boolean inAppEnabled
) {}
