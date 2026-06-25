package com.learnpath.analytics.repository;

import com.learnpath.analytics.entity.AnalyticsPrediction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AnalyticsPredictionRepository extends JpaRepository<AnalyticsPrediction, UUID> {
    List<AnalyticsPrediction> findByUserIdOrderByCreatedAtDesc(UUID userId);
}
