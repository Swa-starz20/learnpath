package com.learnpath.placement.repository;

import com.learnpath.placement.entity.PlacementPreference;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface PlacementPreferenceRepository extends JpaRepository<PlacementPreference, UUID> {
    Optional<PlacementPreference> findByProfileId(UUID profileId);
    boolean existsByProfileId(UUID profileId);
}
