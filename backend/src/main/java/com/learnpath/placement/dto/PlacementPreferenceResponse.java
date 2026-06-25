package com.learnpath.placement.dto;

import com.learnpath.placement.entity.PlacementPreference;
import java.time.Instant;
import java.util.UUID;

public record PlacementPreferenceResponse(
        UUID id,
        UUID profileId,
        boolean prefersRemote,
        boolean prefersHybrid,
        boolean prefersOnsite,
        String preferredCompanySize,
        String preferredIndustry,
        Instant createdAt,
        Instant updatedAt
) {
    public static PlacementPreferenceResponse from(PlacementPreference p) {
        if (p == null) return null;
        return new PlacementPreferenceResponse(
                p.getId(),
                p.getProfile().getId(),
                p.isPrefersRemote(),
                p.isPrefersHybrid(),
                p.isPrefersOnsite(),
                p.getPreferredCompanySize(),
                p.getPreferredIndustry(),
                p.getCreatedAt(),
                p.getUpdatedAt()
        );
    }
}
