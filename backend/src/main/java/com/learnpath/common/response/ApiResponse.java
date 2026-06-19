package com.learnpath.common.response;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.Instant;

/**
 * Standard API response envelope for all LearnPath endpoints.
 *
 * <p>All responses — success and error — share this top-level shape,
 * ensuring the frontend always receives a predictable JSON structure.
 *
 * @param <T> the type of the {@code data} payload
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public record ApiResponse<T>(
        boolean success,
        T data,
        String message,
        Instant timestamp
) {

    /**
     * Creates a successful response with a data payload.
     */
    public static <T> ApiResponse<T> ok(T data) {
        return new ApiResponse<>(true, data, null, Instant.now());
    }

    /**
     * Creates a successful response with a data payload and an informational message.
     */
    public static <T> ApiResponse<T> ok(T data, String message) {
        return new ApiResponse<>(true, data, message, Instant.now());
    }

    /**
     * Creates a successful response with only a message (no data payload).
     */
    public static <T> ApiResponse<T> ok(String message) {
        return new ApiResponse<>(true, null, message, Instant.now());
    }

    /**
     * Creates an error response. Intended for use by {@link com.learnpath.exception.GlobalExceptionHandler}.
     */
    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(false, null, message, Instant.now());
    }
}
