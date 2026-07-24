package com.learnpath.roadmap.dto;

import com.learnpath.roadmap.entity.RoadmapNode;

import java.time.Instant;

/** Read-only view of a {@link RoadmapNode}. */
public record RoadmapNodeResponse(
        Long id,
        Long careerTrackId,
        String title,
        String description,
        String nodeType,
        Integer orderIndex,
        Integer estimatedHours,
        Instant createdAt
) {
    public static RoadmapNodeResponse from(RoadmapNode node) {
        return new RoadmapNodeResponse(
                node.getId(),
                node.getCareerTrack().getId(),
                node.getTitle(),
                node.getDescription(),
                node.getNodeType(),
                node.getOrderIndex(),
                node.getEstimatedHours(),
                node.getCreatedAt()
        );
    }
}
