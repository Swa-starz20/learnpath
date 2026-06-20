package com.learnpath.progression.controller;

import com.learnpath.common.response.ApiResponse;
import com.learnpath.exception.AuthenticationException;
import com.learnpath.progression.dto.AddXpRequest;
import com.learnpath.progression.dto.ProgressionResponse;
import com.learnpath.progression.service.ProgressionService;
import com.learnpath.security.UserPrincipal;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for user progression (XP, mastery score).
 *
 * <p>Base path: {@code /api/v1/progression}
 */
@RestController
@RequestMapping("/api/v1/progression")
public class ProgressionController {

    private final ProgressionService progressionService;

    public ProgressionController(ProgressionService progressionService) {
        this.progressionService = progressionService;
    }

    /** GET /api/v1/progression — get or create the current user's progression record. */
    @GetMapping
    public ResponseEntity<ApiResponse<ProgressionResponse>> getProgression(
            @AuthenticationPrincipal UserPrincipal principal) {
        if (principal == null) throw new AuthenticationException("Authentication required.");
        return ResponseEntity.ok(ApiResponse.ok(progressionService.getOrCreateProgression(principal.getId())));
    }

    /** POST /api/v1/progression/xp — add XP to the current user. */
    @PostMapping("/xp")
    public ResponseEntity<ApiResponse<ProgressionResponse>> addXp(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody AddXpRequest request) {
        if (principal == null) throw new AuthenticationException("Authentication required.");
        return ResponseEntity.ok(ApiResponse.ok(
                progressionService.addXp(principal.getId(), request), "XP added successfully."));
    }
}
