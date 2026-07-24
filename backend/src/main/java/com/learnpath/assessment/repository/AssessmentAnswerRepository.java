package com.learnpath.assessment.repository;

import com.learnpath.assessment.entity.AssessmentAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * JPA repository for {@link AssessmentAnswer} entities.
 */
@Repository
public interface AssessmentAnswerRepository extends JpaRepository<AssessmentAnswer, UUID> {

    /** Returns all answers for a session. */
    List<AssessmentAnswer> findBySessionId(UUID sessionId);

    /** Finds an existing answer for a specific question in a session (for upsert). */
    Optional<AssessmentAnswer> findBySessionIdAndQuestionId(UUID sessionId, UUID questionId);

    /** Counts answers submitted for a session. */
    long countBySessionId(UUID sessionId);
}
