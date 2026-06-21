package com.learnpath.assessment.controller;

import com.learnpath.assessment.dto.*;
import com.learnpath.assessment.service.AssessmentService;
import com.learnpath.common.response.ApiResponse;
import com.learnpath.exception.AuthenticationException;
import com.learnpath.security.UserPrincipal;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * REST controller for the assessment module.
 *
 * <p>Base path: {@code /api/v1/assessments}
 *
 * <p>Public endpoints (no auth required):
 * <ul>
 *   <li>GET /api/v1/assessments/templates</li>
 *   <li>GET /api/v1/assessments/templates/{id}</li>
 * </ul>
 *
 * <p>Authenticated endpoints (Bearer token required):
 * <ul>
 *   <li>POST /api/v1/assessments/sessions/start</li>
 *   <li>GET  /api/v1/assessments/sessions/{id}</li>
 *   <li>POST /api/v1/assessments/sessions/{id}/answer</li>
 *   <li>POST /api/v1/assessments/sessions/{id}/submit</li>
 *   <li>GET  /api/v1/assessments/results/{id}</li>
 *   <li>GET  /api/v1/assessments/my-results</li>
 * </ul>
 */
@RestController
@RequestMapping("/api/v1/assessments")
public class AssessmentController {

    private final AssessmentService assessmentService;

    public AssessmentController(AssessmentService assessmentService) {
        this.assessmentService = assessmentService;
    }

    // ── Public: template catalog ───────────────────────────────────────────────

    /**
     * GET /api/v1/assessments/templates
     * Returns all active assessment templates.
     */
    @GetMapping("/templates")
    public ResponseEntity<ApiResponse<List<AssessmentTemplateResponse>>> listTemplates() {
        return ResponseEntity.ok(ApiResponse.ok(assessmentService.listActiveTemplates()));
    }

    /**
     * GET /api/v1/assessments/templates/{id}
     * Returns a single assessment template by ID.
     */
    @GetMapping("/templates/{id}")
    public ResponseEntity<ApiResponse<AssessmentTemplateResponse>> getTemplate(
            @PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.ok(assessmentService.getTemplateById(id)));
    }

    // ── Authenticated: session management ─────────────────────────────────────

    /**
     * POST /api/v1/assessments/sessions/start
     * Starts a new assessment session for the authenticated user.
     */
    @PostMapping("/sessions/start")
    public ResponseEntity<ApiResponse<AssessmentSessionResponse>> startSession(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody StartSessionRequest request) {
        requireAuth(principal);
        AssessmentSessionResponse session = assessmentService.startSession(principal.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(session, "Assessment session started."));
    }

    /**
     * GET /api/v1/assessments/sessions/{id}
     * Returns session details for the authenticated user.
     */
    @GetMapping("/sessions/{id}")
    public ResponseEntity<ApiResponse<AssessmentSessionResponse>> getSession(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID id) {
        requireAuth(principal);
        return ResponseEntity.ok(ApiResponse.ok(assessmentService.getSession(id, principal.getId())));
    }

    /**
     * POST /api/v1/assessments/sessions/{id}/answer
     * Records or updates an answer for a question in the session.
     */
    @PostMapping("/sessions/{id}/answer")
    public ResponseEntity<ApiResponse<AssessmentAnswerResponse>> submitAnswer(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID id,
            @Valid @RequestBody SubmitAnswerRequest request) {
        requireAuth(principal);
        AssessmentAnswerResponse answer = assessmentService.submitAnswer(id, principal.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok(answer, "Answer recorded."));
    }

    /**
     * POST /api/v1/assessments/sessions/{id}/submit
     * Submits (finalises) the session and creates a result record.
     */
    @PostMapping("/sessions/{id}/submit")
    public ResponseEntity<ApiResponse<AssessmentResultResponse>> submitSession(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID id,
            @Valid @RequestBody SubmitSessionRequest request) {
        requireAuth(principal);
        AssessmentResultResponse result = assessmentService.submitSession(id, principal.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(result, "Assessment submitted successfully."));
    }

    /**
     * GET /api/v1/assessments/results/{id}
     * Returns an assessment result by ID.
     */
    @GetMapping("/results/{id}")
    public ResponseEntity<ApiResponse<AssessmentResultResponse>> getResult(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID id) {
        requireAuth(principal);
        return ResponseEntity.ok(ApiResponse.ok(assessmentService.getResult(id, principal.getId())));
    }

    /**
     * GET /api/v1/assessments/my-results
     * Returns all results for the authenticated user.
     */
    @GetMapping("/my-results")
    public ResponseEntity<ApiResponse<List<AssessmentResultResponse>>> getMyResults(
            @AuthenticationPrincipal UserPrincipal principal) {
        requireAuth(principal);
        return ResponseEntity.ok(ApiResponse.ok(assessmentService.getMyResults(principal.getId())));
    }

    // ── Private helper ────────────────────────────────────────────────────────

    private void requireAuth(UserPrincipal principal) {
        if (principal == null) {
            throw new AuthenticationException("Authentication required.");
        }
    }
}
