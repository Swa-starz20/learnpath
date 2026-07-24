package com.learnpath.assessment.repository;

import com.learnpath.assessment.entity.AssessmentSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * JPA repository for {@link AssessmentSession} entities.
 */
@Repository
public interface AssessmentSessionRepository extends JpaRepository<AssessmentSession, UUID> {

    /**
     * Finds the active (IN_PROGRESS) session for a given user + template combination.
     * Used to enforce the one-active-session-per-template business rule.
     */
    Optional<AssessmentSession> findByUserIdAndTemplateIdAndStatus(
            UUID userId, UUID templateId, String status);

    /**
     * Returns all sessions for a user ordered by start time descending.
     */
    List<AssessmentSession> findByUserIdOrderByStartedAtDesc(UUID userId);

    /**
     * Checks whether a user has any IN_PROGRESS session for a template.
     */
    boolean existsByUserIdAndTemplateIdAndStatus(UUID userId, UUID templateId, String status);
}
