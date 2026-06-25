package com.learnpath.placement.dto;

import com.learnpath.placement.entity.PlacementProfile;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record PlacementProfileResponse(
        UUID id,
        UUID userId,
        Long domainId,
        BigDecimal currentCgpa,
        BigDecimal targetPackageLpa,
        String preferredLocation,
        Instant createdAt,
        Instant updatedAt
) {
    public static PlacementProfileResponse from(PlacementProfile p) {
        if (p == null) return null;
        return new PlacementProfileResponse(
                p.getId(),
                p.getUserId(),
                p.getDomainId(),
                p.getCurrentCgpa(),
                p.getTargetPackageLpa(),
                p.getPreferredLocation(),
                p.getCreatedAt(),
                p.getUpdatedAt()
        );
    }
}
