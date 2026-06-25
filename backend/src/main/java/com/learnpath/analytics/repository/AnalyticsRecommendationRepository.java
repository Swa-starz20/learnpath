package com.learnpath.analytics.repository;

import com.learnpath.analytics.entity.AnalyticsRecommendation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AnalyticsRecommendationRepository extends JpaRepository<AnalyticsRecommendation, UUID> {
    List<AnalyticsRecommendation> findByUserIdOrderByCreatedAtDesc(UUID userId);
    List<AnalyticsRecommendation> findByUserIdAndCompletedFalseOrderByCreatedAtDesc(UUID userId);
    boolean existsByUserIdAndRecommendationTypeAndTitleAndCompletedFalse(UUID userId, String recommendationType, String title);
}
