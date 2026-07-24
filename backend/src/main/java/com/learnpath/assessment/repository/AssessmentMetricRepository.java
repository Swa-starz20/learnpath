package com.learnpath.assessment.repository;

import com.learnpath.assessment.entity.AssessmentMetric;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface AssessmentMetricRepository extends JpaRepository<AssessmentMetric, UUID> {

    /** Finds the assessment metric for a given result. */
    Optional<AssessmentMetric> findByAssessmentResultId(UUID resultId);

    /** Checks whether an assessment metric already exists for the result. */
    boolean existsByAssessmentResultId(UUID resultId);
}
