package com.learnpath.placement.repository;

import com.learnpath.placement.entity.PlacementTarget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PlacementTargetRepository extends JpaRepository<PlacementTarget, UUID> {
    List<PlacementTarget> findByProfileId(UUID profileId);
    List<PlacementTarget> findByProfileIdOrderByPriorityAsc(UUID profileId);
    List<PlacementTarget> findByProfileUserIdAndCompanyNameContainingIgnoreCaseOrProfileUserIdAndRoleNameContainingIgnoreCase(UUID userId1, String companyName, UUID userId2, String roleName);
}
