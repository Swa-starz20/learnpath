package com.learnpath.auth.controller;

import com.learnpath.auth.dto.AuthResponse;
import com.learnpath.auth.dto.LoginRequest;
import com.learnpath.auth.dto.RegisterRequest;
import com.learnpath.auth.service.AuthService;
import com.learnpath.common.response.ApiResponse;
import com.learnpath.exception.AuthenticationException;
import com.learnpath.security.UserPrincipal;
import com.learnpath.user.dto.UserResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * Authentication REST controller.
 *
 * <p>All endpoints under {@code /api/v1/auth/} are public (no token required)
 * except {@code /me} which requires a valid Bearer token.
 */
@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // ── POST /api/v1/auth/register ────────────────────────────────────────────

    /**
     * Registers a new user account.
     *
     * <p>Returns HTTP 201 Created with a JWT token on success.
     * Returns 409 Conflict if the email is already in use.
     * Returns 400 Bad Request with per-field errors for validation failures.
     */
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(
            @Valid @RequestBody RegisterRequest request) {
        AuthResponse authResponse = authService.register(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.ok(authResponse, "Account created successfully."));
    }

    // ── POST /api/v1/auth/login ───────────────────────────────────────────────

    /**
     * Authenticates an existing user.
     *
     * <p>Returns HTTP 200 OK with a JWT token on success.
     * Returns 401 Unauthorized for invalid credentials.
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest request) {
        AuthResponse authResponse = authService.login(request);
        return ResponseEntity.ok(ApiResponse.ok(authResponse, "Login successful."));
    }

    // ── GET /api/v1/auth/me ───────────────────────────────────────────────────

    /**
     * Returns the currently authenticated user's profile.
     *
     * <p>Requires a valid {@code Authorization: Bearer <token>} header.
     * The user's identity is derived from the JWT — never from a request parameter.
     */
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser(
            @AuthenticationPrincipal UserPrincipal principal) {
        // Safety net: principal should never be null here because /me requires
        // authentication in SecurityConfig. If it is null, return 401.
        if (principal == null) {
            throw new AuthenticationException("Authentication required.");
        }
        UserResponse user = authService.getCurrentUser(principal);
        return ResponseEntity.ok(ApiResponse.ok(user));
    }
}
