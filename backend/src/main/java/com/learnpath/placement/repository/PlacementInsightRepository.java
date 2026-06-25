package com.learnpath.placement.repository;

import com.learnpath.placement.entity.PlacementInsight;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PlacementInsightRepository extends JpaRepository<PlacementInsight, UUID> {
    List<PlacementInsight> findByProfileId(UUID profileId);
    List<PlacementInsight> findByUserId(UUID userId);
    List<PlacementInsight> findByAssessmentResultId(UUID assessmentResultId);
    boolean existsByAssessmentResultIdAndCategoryAndInsightType(UUID assessmentResultId, String category, String insightType);
}
