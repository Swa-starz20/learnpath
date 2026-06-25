package com.learnpath.notification.service;

import com.learnpath.exception.AppException;
import com.learnpath.notification.dto.NotificationPreferenceResponse;
import com.learnpath.notification.dto.NotificationResponse;
import com.learnpath.notification.dto.UpdateNotificationPreferenceRequest;
import com.learnpath.notification.entity.Notification;
import com.learnpath.notification.entity.NotificationPreference;
import com.learnpath.notification.entity.NotificationStatus;
import com.learnpath.notification.repository.NotificationPreferenceRepository;
import com.learnpath.notification.repository.NotificationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);

    private final NotificationRepository notificationRepository;
    private final NotificationPreferenceRepository preferenceRepository;

    public NotificationService(NotificationRepository notificationRepository,
                               NotificationPreferenceRepository preferenceRepository) {
        this.notificationRepository = notificationRepository;
        this.preferenceRepository = preferenceRepository;
    }

    @Transactional
    public NotificationResponse createNotification(UUID userId, String notificationType, String title, String message, String priority, String actionUrl) {
        log.info("Creating notification for user: {}, type: {}", userId, notificationType);
        
        NotificationPreference preferences = getOrCreatePreferences(userId);
        
        boolean isEnabled = true;
        if (!preferences.isInAppEnabled()) {
            isEnabled = false;
        } else {
            switch (notificationType.toUpperCase()) {
                case "ASSESSMENT":
                    isEnabled = preferences.isAssessmentNotifications();
                    break;
                case "MENTOR":
                    isEnabled = preferences.isMentorNotifications();
                    break;
                case "PLACEMENT":
                    isEnabled = preferences.isPlacementNotifications();
                    break;
                case "ANALYTICS":
                    isEnabled = preferences.isAnalyticsNotifications();
                    break;
                case "ROADMAP":
                    isEnabled = preferences.isRoadmapNotifications();
                    break;
            }
        }
        
        if (!isEnabled) {
            log.info("Notification skipped based on user preference settings for user: {}, type: {}", userId, notificationType);
            return null;
        }

        Notification notification = new Notification(userId, notificationType, title, message, priority, actionUrl);
        notification = notificationRepository.save(notification);
        return NotificationResponse.from(notification);
    }

    @Transactional
    public NotificationResponse markAsRead(UUID userId, UUID notificationId) {
        log.info("Marking notification {} as read for user: {}", notificationId, userId);
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Notification not found"));

        if (!notification.getUserId().equals(userId)) {
            throw new AppException(HttpStatus.FORBIDDEN, "Access denied");
        }

        if (notification.getStatus() == NotificationStatus.UNREAD) {
            notification.setStatus(NotificationStatus.READ);
            notification.setReadAt(Instant.now());
            notification = notificationRepository.save(notification);
        }

        return NotificationResponse.from(notification);
    }

    @Transactional
    public void markAllAsRead(UUID userId) {
        log.info("Marking all notifications as read for user: {}", userId);
        List<Notification> unread = notificationRepository.findByUserIdAndStatus(userId, NotificationStatus.UNREAD);
        Instant now = Instant.now();
        for (Notification notification : unread) {
            notification.setStatus(NotificationStatus.READ);
            notification.setReadAt(now);
        }
        notificationRepository.saveAll(unread);
    }

    @Transactional(readOnly = true)
    public long getUnreadCount(UUID userId) {
        return notificationRepository.countByUserIdAndStatus(userId, NotificationStatus.UNREAD);
    }

    @Transactional(readOnly = true)
    public Page<NotificationResponse> getLatestNotifications(UUID userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return notificationRepository.findByUserId(userId, pageable)
                .map(NotificationResponse::from);
    }

    @Transactional(readOnly = true)
    public List<NotificationResponse> getUnreadNotifications(UUID userId) {
        return notificationRepository.findByUserIdAndStatusOrderByCreatedAtDesc(userId, NotificationStatus.UNREAD).stream()
                .map(NotificationResponse::from)
                .toList();
    }

    @Transactional
    public NotificationPreferenceResponse getPreferences(UUID userId) {
        NotificationPreference preferences = getOrCreatePreferences(userId);
        return NotificationPreferenceResponse.from(preferences);
    }

    @Transactional
    public NotificationPreferenceResponse updatePreferences(UUID userId, UpdateNotificationPreferenceRequest request) {
        log.info("Updating notification preferences for user: {}", userId);
        NotificationPreference pref = getOrCreatePreferences(userId);
        
        pref.setAssessmentNotifications(request.assessmentNotifications());
        pref.setMentorNotifications(request.mentorNotifications());
        pref.setPlacementNotifications(request.placementNotifications());
        pref.setAnalyticsNotifications(request.analyticsNotifications());
        pref.setRoadmapNotifications(request.roadmapNotifications());
        pref.setEmailEnabled(request.emailEnabled());
        pref.setInAppEnabled(request.inAppEnabled());
        
        pref = preferenceRepository.save(pref);
        return NotificationPreferenceResponse.from(pref);
    }

    @Transactional
    public void cleanupNotifications() {
        log.info("Running weekly notification cleanup for read notifications older than 30 days");
        Instant threshold = Instant.now().minus(30, java.time.temporal.ChronoUnit.DAYS);
        notificationRepository.deleteByStatusAndCreatedAtBefore(NotificationStatus.READ, threshold);
    }

    private NotificationPreference getOrCreatePreferences(UUID userId) {
        return preferenceRepository.findByUserId(userId)
                .orElseGet(() -> preferenceRepository.save(new NotificationPreference(userId)));
    }
}
