package com.learnpath.mentor.dto;

import com.learnpath.mentor.entity.MentorRecommendation;
import java.time.Instant;
import java.util.UUID;

/**
 * Response DTO for a mentor recommendation.
 */
public record MentorRecommendationResponse(
        UUID id,
        UUID userId,
        String recommendationType,
        String title,
        String description,
        String actionUrl,
        boolean completed,
        Instant createdAt
) {
    public static MentorRecommendationResponse from(MentorRecommendation r) {
        return new MentorRecommendationResponse(
                r.getId(),
                r.getUserId(),
                r.getRecommendationType(),
                r.getTitle(),
                r.getDescription(),
                r.getActionUrl(),
                r.isCompleted(),
                r.getCreatedAt()
        );
    }
}
