package com.learnpath.domain.dto;

import com.learnpath.domain.entity.Domain;

import java.time.Instant;

/**
 * Read-only view of a {@link Domain} for API responses.
 */
public record DomainResponse(
        Long id,
        String code,
        String name,
        String description,
        String iconName,
        boolean active,
        Instant createdAt
) {
    public static DomainResponse from(Domain domain) {
        return new DomainResponse(
                domain.getId(),
                domain.getCode(),
                domain.getName(),
                domain.getDescription(),
                domain.getIconName(),
                domain.isActive(),
                domain.getCreatedAt()
        );
    }
}
