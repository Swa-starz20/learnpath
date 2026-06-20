package com.learnpath.course.dto;

import com.learnpath.course.entity.Course;

import java.time.Instant;

/** Read-only view of a {@link Course}. */
public record CourseResponse(
        Long id,
        Long domainId,
        String domainCode,
        Long careerTrackId,
        String title,
        String description,
        String slug,
        String difficultyLevel,
        Integer estimatedHours,
        boolean published,
        Instant createdAt
) {
    public static CourseResponse from(Course course) {
        return new CourseResponse(
                course.getId(),
                course.getDomain().getId(),
                course.getDomain().getCode(),
                course.getCareerTrack() != null ? course.getCareerTrack().getId() : null,
                course.getTitle(),
                course.getDescription(),
                course.getSlug(),
                course.getDifficultyLevel(),
                course.getEstimatedHours(),
                course.isPublished(),
                course.getCreatedAt()
        );
    }
}
