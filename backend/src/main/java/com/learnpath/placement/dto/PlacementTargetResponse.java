package com.learnpath.placement.dto;

import com.learnpath.placement.entity.PlacementTarget;
import java.time.Instant;
import java.util.UUID;

public record PlacementTargetResponse(
        UUID id,
        UUID profileId,
        String companyName,
        String roleName,
        Integer priority,
        Instant createdAt
) {
    public static PlacementTargetResponse from(PlacementTarget t) {
        if (t == null) return null;
        return new PlacementTargetResponse(
                t.getId(),
                t.getProfile().getId(),
                t.getCompanyName(),
                t.getRoleName(),
                t.getPriority(),
                t.getCreatedAt()
        );
    }
}
