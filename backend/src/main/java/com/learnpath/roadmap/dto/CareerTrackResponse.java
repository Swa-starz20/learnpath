package com.learnpath.roadmap.dto;

import com.learnpath.roadmap.entity.CareerTrack;

import java.time.Instant;

/** Read-only view of a {@link CareerTrack}. */
public record CareerTrackResponse(
        Long id,
        Long domainId,
        String domainCode,
        String name,
        String description,
        String difficultyLevel,
        Integer estimatedDurationWeeks,
        boolean active,
        Instant createdAt
) {
    public static CareerTrackResponse from(CareerTrack track) {
        return new CareerTrackResponse(
                track.getId(),
                track.getDomain().getId(),
                track.getDomain().getCode(),
                track.getName(),
                track.getDescription(),
                track.getDifficultyLevel(),
                track.getEstimatedDurationWeeks(),
                track.isActive(),
                track.getCreatedAt()
        );
    }
}
