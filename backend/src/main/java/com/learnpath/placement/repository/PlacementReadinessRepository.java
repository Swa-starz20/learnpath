package com.learnpath.placement.repository;

import com.learnpath.placement.entity.PlacementReadiness;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PlacementReadinessRepository extends JpaRepository<PlacementReadiness, UUID> {
    Optional<PlacementReadiness> findByAssessmentResultId(UUID assessmentResultId);
    Optional<PlacementReadiness> findFirstByProfileIdOrderByCreatedAtDesc(UUID profileId);
    List<PlacementReadiness> findByProfileId(UUID profileId);
    boolean existsByAssessmentResultId(UUID assessmentResultId);
}
