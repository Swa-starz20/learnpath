package com.learnpath.course.dto;

import com.learnpath.course.entity.Lesson;

import java.time.Instant;

/** Read-only view of a {@link Lesson}. */
public record LessonResponse(
        Long id,
        Long moduleId,
        String title,
        String contentType,
        String contentUrl,
        Integer orderIndex,
        Integer durationMinutes,
        Instant createdAt
) {
    public static LessonResponse from(Lesson lesson) {
        return new LessonResponse(
                lesson.getId(),
                lesson.getModule().getId(),
                lesson.getTitle(),
                lesson.getContentType(),
                lesson.getContentUrl(),
                lesson.getOrderIndex(),
                lesson.getDurationMinutes(),
                lesson.getCreatedAt()
        );
    }
}
