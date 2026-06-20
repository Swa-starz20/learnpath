package com.learnpath.course.service;

import com.learnpath.course.dto.CompleteEntityRequest;
import com.learnpath.course.dto.CompletionRecordResponse;
import com.learnpath.course.dto.CourseResponse;
import com.learnpath.course.entity.CompletionRecord;
import com.learnpath.course.entity.Course;
import com.learnpath.course.repository.CompletionRecordRepository;
import com.learnpath.course.repository.CourseRepository;
import com.learnpath.exception.DuplicateResourceException;
import com.learnpath.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Service for course catalog and completion tracking.
 */
@Service
public class CourseService {

    private final CourseRepository courseRepository;
    private final CompletionRecordRepository completionRecordRepository;

    public CourseService(CourseRepository courseRepository,
                         CompletionRecordRepository completionRecordRepository) {
        this.courseRepository = courseRepository;
        this.completionRecordRepository = completionRecordRepository;
    }

    @Transactional(readOnly = true)
    public List<CourseResponse> listCourses(Long domainId) {
        List<Course> courses = (domainId != null)
                ? courseRepository.findByDomainIdAndPublishedTrueOrderByTitleAsc(domainId)
                : courseRepository.findByPublishedTrueOrderByTitleAsc();
        return courses.stream().map(CourseResponse::from).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CourseResponse getCourseById(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", id));
        return CourseResponse.from(course);
    }

    @Transactional(readOnly = true)
    public CourseResponse getCourseBySlug(String slug) {
        Course course = courseRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "slug", slug));
        return CourseResponse.from(course);
    }

    @Transactional
    public CompletionRecordResponse recordCompletion(UUID userId, CompleteEntityRequest request) {
        String entityType = request.entityType().toUpperCase();
        Long entityId = request.entityId();

        if (completionRecordRepository.existsByUserIdAndEntityTypeAndEntityId(userId, entityType, entityId)) {
            throw new DuplicateResourceException(
                    entityType + " " + entityId + " is already completed by this user.");
        }
        CompletionRecord record = new CompletionRecord(userId, entityType, entityId);
        return CompletionRecordResponse.from(completionRecordRepository.save(record));
    }

    @Transactional(readOnly = true)
    public List<CompletionRecordResponse> getUserCompletions(UUID userId) {
        return completionRecordRepository.findByUserId(userId)
                .stream()
                .map(CompletionRecordResponse::from)
                .collect(Collectors.toList());
    }
}
