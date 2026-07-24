package com.learnpath.roadmap.dto;

import com.learnpath.roadmap.entity.UserRoadmapProgress;

import java.time.Instant;
import java.util.UUID;

/** Read-only view of a user's roadmap node progress. */
public record UserProgressResponse(
        Long id,
        UUID userId,
        Long careerTrackId,
        Long roadmapNodeId,
        String nodeTitle,
        String status,
        Instant completedAt,
        Instant updatedAt
) {
    public static UserProgressResponse from(UserRoadmapProgress progress) {
        return new UserProgressResponse(
                progress.getId(),
                progress.getUserId(),
                progress.getCareerTrack().getId(),
                progress.getRoadmapNode().getId(),
                progress.getRoadmapNode().getTitle(),
                progress.getStatus(),
                progress.getCompletedAt(),
                progress.getUpdatedAt()
        );
    }
}
