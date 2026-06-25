package com.learnpath.notification;

import com.learnpath.notification.dto.NotificationDeliveryLogResponse;
import com.learnpath.notification.entity.*;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.Instant;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

class NotificationDeliveryLogTest {

    @Test
    @DisplayName("Verify NotificationDeliveryLog DTO conversion")
    void testDtoConversion() {
        Notification notification = new Notification();
        UUID notificationId = UUID.randomUUID();
        notification.setId(notificationId);
        notification.setTitle("Test Title");

        Instant now = Instant.now();
        NotificationDeliveryLog log = new NotificationDeliveryLog(
                notification,
                DeliveryChannel.EMAIL,
                DeliveryStatus.SENT,
                now,
                "No failure"
        );
        UUID logId = UUID.randomUUID();
        log.setId(logId);

        NotificationDeliveryLogResponse response = NotificationDeliveryLogResponse.from(log);

        assertNotNull(response);
        assertEquals(logId, response.id());
        assertEquals(notificationId, response.notificationId());
        assertEquals(DeliveryChannel.EMAIL, response.deliveryChannel());
        assertEquals(DeliveryStatus.SENT, response.deliveryStatus());
        assertEquals(now, response.deliveredAt());
        assertEquals("No failure", response.failureReason());
    }

    @Test
    @DisplayName("Verify NotificationDeliveryLogResponse returns null for null entity")
    void testNullDtoConversion() {
        assertNull(NotificationDeliveryLogResponse.from(null));
    }
}
