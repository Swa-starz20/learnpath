package com.learnpath.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Request body for {@code POST /api/v1/auth/login}.
 *
 * @param email    the user's registered email address
 * @param password the user's password (plaintext — compared against BCrypt hash)
 */
public record LoginRequest(

        @NotBlank(message = "Email is required")
        @Email(message = "Must be a valid email address")
        String email,

        @NotBlank(message = "Password is required")
        @Size(min = 1, max = 72, message = "Password must not exceed 72 characters")
        String password
) {}
