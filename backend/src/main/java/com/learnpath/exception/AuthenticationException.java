package com.learnpath.exception;

import org.springframework.http.HttpStatus;

/**
 * Thrown when a client request fails authentication.
 * Maps to HTTP 401 Unauthorized.
 */
public class AuthenticationException extends AppException {

    public AuthenticationException(String message) {
        super(HttpStatus.UNAUTHORIZED, message);
    }
}
