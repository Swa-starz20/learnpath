package com.learnpath.roadmap.controller;

import com.learnpath.common.response.ApiResponse;
import com.learnpath.exception.AuthenticationException;
import com.learnpath.roadmap.dto.CareerTrackResponse;
import com.learnpath.roadmap.dto.RoadmapNodeResponse;
import com.learnpath.roadmap.dto.UpdateProgressRequest;
import com.learnpath.roadmap.dto.UserProgressResponse;
import com.learnpath.roadmap.service.RoadmapService;
import com.learnpath.security.UserPrincipal;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for career tracks and roadmap progress.
 *
 * <p>Base path: {@code /api/v1/roadmaps}
 */
@RestController
@RequestMapping("/api/v1/roadmaps")
public class RoadmapController {

    private final RoadmapService roadmapService;

    public RoadmapController(RoadmapService roadmapService) {
        this.roadmapService = roadmapService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CareerTrackResponse>>> listTracks(
            @RequestParam(required = false) Long domainId) {
        return ResponseEntity.ok(ApiResponse.ok(roadmapService.listTracks(domainId)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CareerTrackResponse>> getTrack(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(roadmapService.getTrackById(id)));
    }

    @GetMapping("/{id}/nodes")
    public ResponseEntity<ApiResponse<List<RoadmapNodeResponse>>> getNodes(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(roadmapService.getNodesForTrack(id)));
    }

    @GetMapping("/{id}/progress")
    public ResponseEntity<ApiResponse<List<UserProgressResponse>>> getProgress(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal) {
        if (principal == null) throw new AuthenticationException("Authentication required.");
        return ResponseEntity.ok(ApiResponse.ok(roadmapService.getUserProgress(principal.getId(), id)));
    }

    @PostMapping("/{id}/progress")
    public ResponseEntity<ApiResponse<UserProgressResponse>> updateProgress(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody UpdateProgressRequest request) {
        if (principal == null) throw new AuthenticationException("Authentication required.");
        return ResponseEntity.ok(ApiResponse.ok(
                roadmapService.updateProgress(principal.getId(), id, request), "Progress updated."));
    }
}
