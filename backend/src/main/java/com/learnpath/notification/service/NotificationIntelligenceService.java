package com.learnpath.notification.service;

import com.learnpath.notification.dto.NotificationDeliveryLogResponse;
import com.learnpath.notification.dto.NotificationResponse;
import com.learnpath.notification.entity.*;
import com.learnpath.notification.repository.NotificationDeliveryLogRepository;
import com.learnpath.notification.repository.NotificationPreferenceRepository;
import com.learnpath.notification.repository.NotificationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class NotificationIntelligenceService {

    private static final Logger log = LoggerFactory.getLogger(NotificationIntelligenceService.class);

    private final NotificationService notificationService;
    private final NotificationRepository notificationRepository;
    private final NotificationPreferenceRepository preferenceRepository;
    private final NotificationDeliveryLogRepository deliveryLogRepository;

    public NotificationIntelligenceService(
            NotificationService notificationService,
            NotificationRepository notificationRepository,
            NotificationPreferenceRepository preferenceRepository,
            NotificationDeliveryLogRepository deliveryLogRepository) {
        this.notificationService = notificationService;
        this.notificationRepository = notificationRepository;
        this.preferenceRepository = preferenceRepository;
        this.deliveryLogRepository = deliveryLogRepository;
    }

    @Transactional
    public void processEventNotification(UUID userId, String notificationType, String title, String message, String priority, String actionUrl) {
        boolean exists = notificationRepository.existsByUserIdAndNotificationTypeAndTitleAndStatus(
                userId, notificationType, title, NotificationStatus.UNREAD);
        if (exists) {
            log.info("Duplicate unread notification detected for user: {}, type: {}, title: '{}'. Skipping.", userId, notificationType, title);
            return;
        }

        NotificationPreference preferences = preferenceRepository.findByUserId(userId)
                .orElseGet(() -> preferenceRepository.save(new NotificationPreference(userId)));

        NotificationResponse response = notificationService.createNotification(userId, notificationType, title, message, priority, actionUrl);
        if (response != null) {
            Notification notification = notificationRepository.findById(response.id()).orElse(null);
            if (notification != null) {
                if (preferences.isInAppEnabled()) {
                    NotificationDeliveryLog inAppLog = new NotificationDeliveryLog(
                            notification,
                            DeliveryChannel.IN_APP,
                            DeliveryStatus.SENT,
                            Instant.now(),
                            null
                    );
                    deliveryLogRepository.save(inAppLog);
                    log.info("Logged IN_APP notification delivery for user: {}, notificationId: {}", userId, notification.getId());
                }

                if (preferences.isEmailEnabled()) {
                    NotificationDeliveryLog emailLog = new NotificationDeliveryLog(
                            notification,
                            DeliveryChannel.EMAIL,
                            DeliveryStatus.SENT,
                            Instant.now(),
                            null
                    );
                    deliveryLogRepository.save(emailLog);
                    log.info("Logged EMAIL notification delivery for user: {}, notificationId: {}", userId, notification.getId());
                }
            }
        }
    }

    @Transactional(readOnly = true)
    public List<NotificationDeliveryLogResponse> getDeliveryHistory(UUID userId) {
        log.info("Fetching notification delivery log history for user: {}", userId);
        return deliveryLogRepository.findByNotificationUserIdOrderByCreatedAtDesc(userId).stream()
                .map(NotificationDeliveryLogResponse::from)
                .toList();
    }
}
