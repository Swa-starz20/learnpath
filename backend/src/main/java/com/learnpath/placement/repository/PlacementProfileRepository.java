package com.learnpath.placement.repository;

import com.learnpath.placement.entity.PlacementProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PlacementProfileRepository extends JpaRepository<PlacementProfile, UUID> {
    List<PlacementProfile> findByUserId(UUID userId);
    Optional<PlacementProfile> findByUserIdAndDomainId(UUID userId, Long domainId);
    boolean existsByUserIdAndDomainId(UUID userId, Long domainId);
}
