package com.learnpath.assessment.repository;

import com.learnpath.assessment.entity.AssessmentQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * JPA repository for {@link AssessmentQuestion} entities.
 */
@Repository
public interface AssessmentQuestionRepository extends JpaRepository<AssessmentQuestion, UUID> {

    /** Returns all questions for a template ordered by display_order. */
    List<AssessmentQuestion> findByTemplateIdOrderByDisplayOrderAsc(UUID templateId);

    /** Counts questions belonging to a template. */
    long countByTemplateId(UUID templateId);
}
