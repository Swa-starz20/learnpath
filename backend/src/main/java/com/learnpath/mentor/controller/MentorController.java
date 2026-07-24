package com.learnpath.mentor.controller;

import com.learnpath.common.response.ApiResponse;
import com.learnpath.exception.AuthenticationException;
import com.learnpath.mentor.dto.*;
import com.learnpath.mentor.service.MentorService;
import com.learnpath.security.UserPrincipal;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for the AI Mentor Foundation module.
 *
 * <p>Base path: {@code /api/v1/mentor}
 */
@RestController
@RequestMapping("/api/v1/mentor")
public class MentorController {

    private final MentorService mentorService;

    public MentorController(MentorService mentorService) {
        this.mentorService = mentorService;
    }

    /**
     * GET /api/v1/mentor/profile
     * Retrieves the authenticated user's mentor profile.
     */
    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<MentorProfileResponse>> getProfile(
            @AuthenticationPrincipal UserPrincipal principal) {
        requireAuth(principal);
        return ResponseEntity.ok(ApiResponse.ok(mentorService.getProfile(principal.getId())));
    }

    /**
     * POST /api/v1/mentor/profile
     * Creates a mentor profile for the authenticated user.
     */
    @PostMapping("/profile")
    public ResponseEntity<ApiResponse<MentorProfileResponse>> createProfile(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody UpdateMentorProfileRequest request) {
        requireAuth(principal);
        MentorProfileResponse profile = mentorService.createProfile(principal.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(profile, "Mentor profile created successfully."));
    }

    /**
     * PUT /api/v1/mentor/profile
     * Updates the authenticated user's mentor profile.
     */
    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<MentorProfileResponse>> updateProfile(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody UpdateMentorProfileRequest request) {
        requireAuth(principal);
        MentorProfileResponse profile = mentorService.updateProfile(principal.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok(profile, "Mentor profile updated successfully."));
    }

    /**
     * GET /api/v1/mentor/insights
     * Lists active mentor insights for the authenticated user.
     */
    @GetMapping("/insights")
    public ResponseEntity<ApiResponse<List<MentorInsightResponse>>> listInsights(
            @AuthenticationPrincipal UserPrincipal principal) {
        requireAuth(principal);
        return ResponseEntity.ok(ApiResponse.ok(mentorService.listInsights(principal.getId())));
    }

    /**
     * GET /api/v1/mentor/recommendations
     * Lists active mentor recommendations for the authenticated user.
     */
    @GetMapping("/recommendations")
    public ResponseEntity<ApiResponse<List<MentorRecommendationResponse>>> listRecommendations(
            @AuthenticationPrincipal UserPrincipal principal) {
        requireAuth(principal);
        return ResponseEntity.ok(ApiResponse.ok(mentorService.listRecommendations(principal.getId())));
    }

    private void requireAuth(UserPrincipal principal) {
        if (principal == null) {
            throw new AuthenticationException("Authentication required.");
        }
    }
}
