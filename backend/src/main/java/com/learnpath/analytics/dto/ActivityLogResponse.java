package com.learnpath.analytics.dto;

import com.learnpath.analytics.entity.ActivityLog;
import java.time.Instant;
import java.util.Map;
import java.util.UUID;

public record ActivityLogResponse(
        UUID id,
        UUID userId,
        String activityType,
        String referenceId,
        Map<String, Object> metadata,
        Instant createdAt
) {
    public static ActivityLogResponse from(ActivityLog log) {
        if (log == null) return null;
        return new ActivityLogResponse(
                log.getId(),
                log.getUserId(),
                log.getActivityType(),
                log.getReferenceId(),
                log.getMetadata(),
                log.getCreatedAt()
        );
    }
}
