package com.learnpath.notification.repository;

import com.learnpath.notification.entity.NotificationDeliveryLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface NotificationDeliveryLogRepository extends JpaRepository<NotificationDeliveryLog, UUID> {
    List<NotificationDeliveryLog> findByNotificationUserIdOrderByCreatedAtDesc(UUID userId);
}
