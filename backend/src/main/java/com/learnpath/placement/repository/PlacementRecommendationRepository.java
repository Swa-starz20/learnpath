package com.learnpath.placement.repository;

import com.learnpath.placement.entity.PlacementRecommendation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PlacementRecommendationRepository extends JpaRepository<PlacementRecommendation, UUID> {
    List<PlacementRecommendation> findByProfileId(UUID profileId);
    List<PlacementRecommendation> findByProfileIdAndActiveTrue(UUID profileId);
    List<PlacementRecommendation> findByAssessmentResultId(UUID assessmentResultId);
    boolean existsByProfileIdAndRecommendationTypeAndTitleAndActiveTrue(UUID profileId, String recommendationType, String title);
}
