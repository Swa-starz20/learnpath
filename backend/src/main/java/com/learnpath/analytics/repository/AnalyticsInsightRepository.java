package com.learnpath.analytics.repository;

import com.learnpath.analytics.entity.AnalyticsInsight;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AnalyticsInsightRepository extends JpaRepository<AnalyticsInsight, UUID> {
    List<AnalyticsInsight> findByUserIdOrderByGeneratedAtDesc(UUID userId);
    boolean existsByUserIdAndInsightTypeAndSnapshotId(UUID userId, String insightType, UUID snapshotId);
    boolean existsByUserIdAndInsightTypeAndAssessmentResultId(UUID userId, String insightType, UUID assessmentResultId);
}
