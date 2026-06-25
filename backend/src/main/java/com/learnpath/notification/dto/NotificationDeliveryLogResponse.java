package com.learnpath.notification.dto;

import com.learnpath.notification.entity.DeliveryChannel;
import com.learnpath.notification.entity.DeliveryStatus;
import com.learnpath.notification.entity.NotificationDeliveryLog;
import java.time.Instant;
import java.util.UUID;

public record NotificationDeliveryLogResponse(
        UUID id,
        UUID notificationId,
        DeliveryChannel deliveryChannel,
        DeliveryStatus deliveryStatus,
        Instant deliveredAt,
        String failureReason,
        Instant createdAt
) {
    public static NotificationDeliveryLogResponse from(NotificationDeliveryLog log) {
        if (log == null) return null;
        return new NotificationDeliveryLogResponse(
                log.getId(),
                log.getNotification().getId(),
                log.getDeliveryChannel(),
                log.getDeliveryStatus(),
                log.getDeliveredAt(),
                log.getFailureReason(),
                log.getCreatedAt()
        );
    }
}
