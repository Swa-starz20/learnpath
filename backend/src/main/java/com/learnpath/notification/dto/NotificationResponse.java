package com.learnpath.notification.dto;

import com.learnpath.notification.entity.Notification;
import com.learnpath.notification.entity.NotificationStatus;
import java.time.Instant;
import java.util.UUID;

public record NotificationResponse(
        UUID id,
        UUID userId,
        String notificationType,
        String title,
        String message,
        String priority,
        NotificationStatus status,
        String actionUrl,
        Instant createdAt,
        Instant readAt
) {
    public static NotificationResponse from(Notification notification) {
        if (notification == null) return null;
        return new NotificationResponse(
                notification.getId(),
                notification.getUserId(),
                notification.getNotificationType(),
                notification.getTitle(),
                notification.getMessage(),
                notification.getPriority(),
                notification.getStatus(),
                notification.getActionUrl(),
                notification.getCreatedAt(),
                notification.getReadAt()
        );
    }
}
