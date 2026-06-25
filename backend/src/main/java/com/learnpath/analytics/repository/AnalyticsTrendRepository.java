package com.learnpath.analytics.repository;

import com.learnpath.analytics.entity.AnalyticsTrend;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AnalyticsTrendRepository extends JpaRepository<AnalyticsTrend, UUID> {
    List<AnalyticsTrend> findByUserIdOrderByCalculatedAtDesc(UUID userId);
}
