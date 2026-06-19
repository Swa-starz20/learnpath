package com.learnpath.exception;

import org.springframework.http.HttpStatus;

/**
 * Base application exception for LearnPath.
 *
 * <p>All domain-specific exceptions should extend this class.
 * The {@link GlobalExceptionHandler} catches {@code AppException} and maps
 * it to the appropriate HTTP status code.
 */
public class AppException extends RuntimeException {

    private final HttpStatus status;

    public AppException(HttpStatus status, String message) {
        super(message);
        this.status = status;
    }

    public AppException(HttpStatus status, String message, Throwable cause) {
        super(message, cause);
        this.status = status;
    }

    public HttpStatus getStatus() {
        return status;
    }
}
