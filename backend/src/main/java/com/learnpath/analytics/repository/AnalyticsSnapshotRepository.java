package com.learnpath.analytics.repository;

import com.learnpath.analytics.entity.AnalyticsSnapshot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface AnalyticsSnapshotRepository extends JpaRepository<AnalyticsSnapshot, UUID> {
    Optional<AnalyticsSnapshot> findFirstByUserIdOrderBySnapshotTimeDesc(UUID userId);
    java.util.List<AnalyticsSnapshot> findByUserIdOrderBySnapshotTimeDesc(UUID userId);
    void deleteBySnapshotTimeBefore(java.time.Instant threshold);
}
