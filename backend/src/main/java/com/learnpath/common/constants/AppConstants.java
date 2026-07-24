package com.learnpath.common.constants;

/**
 * Platform-wide constants for LearnPath.
 *
 * <p>Centralised here to avoid magic strings scattered across the codebase.
 */
public final class AppConstants {

    private AppConstants() {
        // Utility class — no instantiation
    }

    // ── JWT ──────────────────────────────────────────────────────────────────

    /** Bearer token prefix used in the {@code Authorization} header. */
    public static final String BEARER_PREFIX = "Bearer ";

    /** HTTP header name for JWT tokens. */
    public static final String AUTH_HEADER = "Authorization";

    // ── Roles ─────────────────────────────────────────────────────────────────

    /** Default role assigned to every new registration. */
    public static final String ROLE_STUDENT = "STUDENT";

    /** Administrative role with elevated permissions. */
    public static final String ROLE_ADMIN = "ADMIN";

    // ── Pagination defaults ───────────────────────────────────────────────────

    public static final int DEFAULT_PAGE = 0;
    public static final int DEFAULT_PAGE_SIZE = 20;
    public static final int MAX_PAGE_SIZE = 100;

    // ── Validation ───────────────────────────────────────────────────────────

    /** Minimum password length enforced at registration. */
    public static final int MIN_PASSWORD_LENGTH = 8;

    /** Maximum password length accepted at registration. */
    public static final int MAX_PASSWORD_LENGTH = 72; // BCrypt limit

    // ── API versioning ───────────────────────────────────────────────────────

    public static final String API_V1 = "/api/v1";
}
