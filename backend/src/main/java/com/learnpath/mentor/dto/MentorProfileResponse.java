package com.learnpath.mentor.dto;

import com.learnpath.mentor.entity.MentorProfile;
import java.time.Instant;
import java.util.UUID;

/**
 * Response DTO for a mentor profile.
 */
public record MentorProfileResponse(
        UUID id,
        UUID userId,
        Long primaryDomainId,
        String currentLevel,
        String targetRole,
        Instant createdAt,
        Instant updatedAt
) {
    public static MentorProfileResponse from(MentorProfile p) {
        return new MentorProfileResponse(
                p.getId(),
                p.getUserId(),
                p.getPrimaryDomainId(),
                p.getCurrentLevel(),
                p.getTargetRole(),
                p.getCreatedAt(),
                p.getUpdatedAt()
        );
    }
}
