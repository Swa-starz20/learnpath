package com.learnpath.assessment.repository;

import com.learnpath.assessment.entity.AssessmentResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * JPA repository for {@link AssessmentResult} entities.
 */
@Repository
public interface AssessmentResultRepository extends JpaRepository<AssessmentResult, UUID> {

    /** Finds the result for a session (should be at most one due to UNIQUE constraint). */
    Optional<AssessmentResult> findBySessionId(UUID sessionId);

    /** Checks whether a result already exists for a session (prevent double-creation). */
    boolean existsBySessionId(UUID sessionId);

    /** Returns all results for a user ordered by completion time descending. */
    List<AssessmentResult> findByUserIdOrderByCompletedAtDesc(UUID userId);
}
