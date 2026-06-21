package com.learnpath.assessment.repository;

import com.learnpath.assessment.entity.AssessmentTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * JPA repository for {@link AssessmentTemplate} entities.
 */
@Repository
public interface AssessmentTemplateRepository extends JpaRepository<AssessmentTemplate, UUID> {

    /** Returns all active templates ordered by name. */
    List<AssessmentTemplate> findByActiveTrueOrderByNameAsc();

    /** Finds a template by its unique code. */
    Optional<AssessmentTemplate> findByCode(String code);

    /** Checks whether a template with the given code exists. */
    boolean existsByCode(String code);

    /** Returns all active templates for a specific domain. */
    List<AssessmentTemplate> findByDomainIdAndActiveTrueOrderByNameAsc(Long domainId);
}
