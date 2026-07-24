package com.learnpath.auth.dto;

import com.learnpath.user.dto.UserResponse;

/**
 * Response body for successful authentication operations (register, login).
 *
 * @param accessToken the signed JWT Bearer token
 * @param tokenType   always {@code "Bearer"}
 * @param expiresIn   token lifetime in seconds
 * @param user        the authenticated user's public profile
 */
public record AuthResponse(
        String accessToken,
        String tokenType,
        long expiresIn,
        UserResponse user
) {
    public static AuthResponse of(String token, long ttlSeconds, UserResponse user) {
        return new AuthResponse(token, "Bearer", ttlSeconds, user);
    }
}
