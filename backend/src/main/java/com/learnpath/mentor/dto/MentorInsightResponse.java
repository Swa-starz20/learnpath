package com.learnpath.mentor.dto;

import com.learnpath.mentor.entity.MentorInsight;
import java.time.Instant;
import java.util.UUID;

/**
 * Response DTO for a mentor insight.
 */
public record MentorInsightResponse(
        UUID id,
        UUID userId,
        String insightType,
        String title,
        String description,
        Integer priority,
        Instant generatedAt
) {
    public static MentorInsightResponse from(MentorInsight i) {
        return new MentorInsightResponse(
                i.getId(),
                i.getUserId(),
                i.getInsightType(),
                i.getTitle(),
                i.getDescription(),
                i.getPriority(),
                i.getGeneratedAt()
        );
    }
}
