package com.learnpath.assessment.repository;

import com.learnpath.assessment.entity.AssessmentOption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * JPA repository for {@link AssessmentOption} entities.
 */
@Repository
public interface AssessmentOptionRepository extends JpaRepository<AssessmentOption, UUID> {

    /** Returns all options for a question ordered by display_order. */
    List<AssessmentOption> findByQuestionIdOrderByDisplayOrderAsc(UUID questionId);

    /** Returns all options for all questions in a list (batch fetch). */
    List<AssessmentOption> findByQuestionIdInOrderByDisplayOrderAsc(List<UUID> questionIds);
}
