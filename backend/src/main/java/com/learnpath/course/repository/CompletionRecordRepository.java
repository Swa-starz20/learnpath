package com.learnpath.course.repository;

import com.learnpath.course.entity.CompletionRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CompletionRecordRepository extends JpaRepository<CompletionRecord, Long> {
    List<CompletionRecord> findByUserId(UUID userId);
    Optional<CompletionRecord> findByUserIdAndEntityTypeAndEntityId(UUID userId, String entityType, Long entityId);
    boolean existsByUserIdAndEntityTypeAndEntityId(UUID userId, String entityType, Long entityId);
    long countByUserIdAndEntityType(UUID userId, String entityType);
}
