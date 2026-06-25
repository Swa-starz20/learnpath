package com.learnpath.notification.repository;

import com.learnpath.notification.entity.Notification;
import com.learnpath.notification.entity.NotificationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, UUID> {
    Page<Notification> findByUserId(UUID userId, Pageable pageable);
    List<Notification> findByUserIdAndStatusOrderByCreatedAtDesc(UUID userId, NotificationStatus status);
    long countByUserIdAndStatus(UUID userId, NotificationStatus status);
    List<Notification> findByUserIdAndStatus(UUID userId, NotificationStatus status);
    boolean existsByUserIdAndNotificationTypeAndTitleAndStatus(UUID userId, String notificationType, String title, NotificationStatus status);
    void deleteByStatusAndCreatedAtBefore(NotificationStatus status, java.time.Instant dateTime);
}
