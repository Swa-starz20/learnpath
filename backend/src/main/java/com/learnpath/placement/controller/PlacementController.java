package com.learnpath.placement.controller;

import com.learnpath.common.response.ApiResponse;
import com.learnpath.exception.AuthenticationException;
import com.learnpath.placement.dto.*;
import com.learnpath.placement.service.PlacementService;
import com.learnpath.security.UserPrincipal;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for the Placement Foundation module.
 *
 * <p>Base path: {@code /api/v1/placements}
 */
@RestController
@RequestMapping("/api/v1/placements")
public class PlacementController {

    private final PlacementService placementService;

    public PlacementController(PlacementService placementService) {
        this.placementService = placementService;
    }

    /**
     * GET /api/v1/placements/profile
     * Retrieves the placement profile for the authenticated user and domain.
     */
    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<PlacementProfileResponse>> getProfile(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam Long domainId) {
        requireAuth(principal);
        PlacementProfileResponse response = placementService.getProfile(principal.getId(), domainId);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    /**
     * POST /api/v1/placements/profile
     * Creates a placement profile for the authenticated user.
     */
    @PostMapping("/profile")
    public ResponseEntity<ApiResponse<PlacementProfileResponse>> createProfile(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody CreatePlacementProfileRequest request) {
        requireAuth(principal);
        PlacementProfileResponse response = placementService.createProfile(principal.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(response, "Placement profile created successfully."));
    }

    /**
     * PUT /api/v1/placements/profile
     * Updates the placement profile for the authenticated user and domain.
     */
    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<PlacementProfileResponse>> updateProfile(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam Long domainId,
            @Valid @RequestBody UpdatePlacementProfileRequest request) {
        requireAuth(principal);
        PlacementProfileResponse response = placementService.updateProfile(principal.getId(), domainId, request);
        return ResponseEntity.ok(ApiResponse.ok(response, "Placement profile updated successfully."));
    }

    /**
     * GET /api/v1/placements/targets
     * Lists placement targets for the authenticated user and domain.
     */
    @GetMapping("/targets")
    public ResponseEntity<ApiResponse<List<PlacementTargetResponse>>> listTargets(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam Long domainId) {
        requireAuth(principal);
        List<PlacementTargetResponse> response = placementService.listTargets(principal.getId(), domainId);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    /**
     * POST /api/v1/placements/targets
     * Adds a placement target.
     */
    @PostMapping("/targets")
    public ResponseEntity<ApiResponse<PlacementTargetResponse>> addTarget(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody CreatePlacementTargetRequest request) {
        requireAuth(principal);
        PlacementTargetResponse response = placementService.addTarget(principal.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(response, "Placement target added successfully."));
    }

    /**
     * GET /api/v1/placements/preferences
     * Retrieves placement preferences for the authenticated user and domain.
     */
    @GetMapping("/preferences")
    public ResponseEntity<ApiResponse<PlacementPreferenceResponse>> getPreferences(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam Long domainId) {
        requireAuth(principal);
        PlacementPreferenceResponse response = placementService.getPreferences(principal.getId(), domainId);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    /**
     * PUT /api/v1/placements/preferences
     * Updates placement preferences.
     */
    @PutMapping("/preferences")
    public ResponseEntity<ApiResponse<PlacementPreferenceResponse>> updatePreferences(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody UpdatePlacementPreferenceRequest request) {
        requireAuth(principal);
        PlacementPreferenceResponse response = placementService.updatePreferences(principal.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok(response, "Placement preferences updated successfully."));
    }

    /**
     * GET /api/v1/placements/readiness
     * Retrieves placement readiness for the authenticated user and domain.
     */
    @GetMapping("/readiness")
    public ResponseEntity<ApiResponse<PlacementReadinessResponse>> getReadiness(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam Long domainId) {
        requireAuth(principal);
        PlacementReadinessResponse response = placementService.getReadiness(principal.getId(), domainId);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    /**
     * GET /api/v1/placements/insights
     * Lists placement insights for the authenticated user and domain.
     */
    @GetMapping("/insights")
    public ResponseEntity<ApiResponse<List<PlacementInsightResponse>>> listInsights(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam Long domainId) {
        requireAuth(principal);
        List<PlacementInsightResponse> response = placementService.listInsights(principal.getId(), domainId);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    /**
     * GET /api/v1/placements/recommendations
     * Lists placement recommendations for the authenticated user and domain.
     */
    @GetMapping("/recommendations")
    public ResponseEntity<ApiResponse<List<PlacementRecommendationResponse>>> listRecommendations(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam Long domainId) {
        requireAuth(principal);
        List<PlacementRecommendationResponse> response = placementService.listRecommendations(principal.getId(), domainId);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    /**
     * GET /api/v1/placements/fit-scores
     * Lists company fit scores for the authenticated user and domain.
     */
    @GetMapping("/fit-scores")
    public ResponseEntity<ApiResponse<List<CompanyFitScoreResponse>>> listFitScores(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam Long domainId) {
        requireAuth(principal);
        List<CompanyFitScoreResponse> response = placementService.listFitScores(principal.getId(), domainId);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    /**
     * GET /api/v1/placements/gaps
     * Lists skill gaps for the authenticated user and domain.
     */
    @GetMapping("/gaps")
    public ResponseEntity<ApiResponse<List<SkillGapAnalysisResponse>>> listSkillGaps(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam Long domainId) {
        requireAuth(principal);
        List<SkillGapAnalysisResponse> response = placementService.listSkillGaps(principal.getId(), domainId);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    private void requireAuth(UserPrincipal principal) {
        if (principal == null) {
            throw new AuthenticationException("Authentication required.");
        }
    }
}
