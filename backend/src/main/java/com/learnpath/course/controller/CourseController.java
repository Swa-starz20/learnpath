package com.learnpath.course.controller;

import com.learnpath.common.response.ApiResponse;
import com.learnpath.course.dto.CompleteEntityRequest;
import com.learnpath.course.dto.CompletionRecordResponse;
import com.learnpath.course.dto.CourseResponse;
import com.learnpath.course.service.CourseService;
import com.learnpath.exception.AuthenticationException;
import com.learnpath.security.UserPrincipal;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for the course catalog and completion tracking.
 *
 * <p>Base path: {@code /api/v1/courses}
 */
@RestController
@RequestMapping("/api/v1/courses")
public class CourseController {

    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CourseResponse>>> listCourses(
            @RequestParam(required = false) Long domainId) {
        return ResponseEntity.ok(ApiResponse.ok(courseService.listCourses(domainId)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CourseResponse>> getCourse(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(courseService.getCourseById(id)));
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<ApiResponse<CourseResponse>> getCourseBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.ok(courseService.getCourseBySlug(slug)));
    }

    @PostMapping("/complete")
    public ResponseEntity<ApiResponse<CompletionRecordResponse>> recordCompletion(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody CompleteEntityRequest request) {
        if (principal == null) throw new AuthenticationException("Authentication required.");
        CompletionRecordResponse response = courseService.recordCompletion(principal.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(response, "Completion recorded."));
    }

    @GetMapping("/completions")
    public ResponseEntity<ApiResponse<List<CompletionRecordResponse>>> myCompletions(
            @AuthenticationPrincipal UserPrincipal principal) {
        if (principal == null) throw new AuthenticationException("Authentication required.");
        return ResponseEntity.ok(ApiResponse.ok(courseService.getUserCompletions(principal.getId())));
    }
}
