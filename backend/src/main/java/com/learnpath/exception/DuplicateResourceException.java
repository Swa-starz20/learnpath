package com.learnpath.exception;

import org.springframework.http.HttpStatus;

/**
 * Thrown when a client attempts to create a resource that already exists.
 * Maps to HTTP 409 Conflict.
 */
public class DuplicateResourceException extends AppException {

    public DuplicateResourceException(String message) {
        super(HttpStatus.CONFLICT, message);
    }
}
