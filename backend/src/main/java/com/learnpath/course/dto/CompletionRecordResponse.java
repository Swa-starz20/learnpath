package com.learnpath.course.dto;

import com.learnpath.course.entity.CompletionRecord;

import java.time.Instant;
import java.util.UUID;

/** Read-only view of a {@link CompletionRecord}. */
public record CompletionRecordResponse(
        Long id,
        UUID userId,
        String entityType,
        Long entityId,
        Instant completedAt
) {
    public static CompletionRecordResponse from(CompletionRecord record) {
        return new CompletionRecordResponse(
                record.getId(),
                record.getUserId(),
                record.getEntityType(),
                record.getEntityId(),
                record.getCompletedAt()
        );
    }
}
