package com.learnpath.user.dto;

import java.time.Instant;
import java.util.Set;
import java.util.UUID;

/**
 * Read-only view of a {@link com.learnpath.user.entity.User} for API responses.
 *
 * <p>Never expose the password hash in an API response.
 */
public record UserResponse(
        UUID id,
        String email,
        String firstName,
        String lastName,
        String fullName,
        boolean active,
        Set<String> roles,
        Instant createdAt
) {
    public static UserResponse from(com.learnpath.user.entity.User user) {
        Set<String> roleNames = new java.util.LinkedHashSet<>();
        user.getRoles().forEach(r -> roleNames.add(r.getName()));
        return new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getFullName(),
                user.isActive(),
                roleNames,
                user.getCreatedAt()
        );
    }
}
