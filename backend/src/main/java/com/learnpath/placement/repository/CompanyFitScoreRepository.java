package com.learnpath.placement.repository;

import com.learnpath.placement.entity.CompanyFitScore;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CompanyFitScoreRepository extends JpaRepository<CompanyFitScore, UUID> {
    List<CompanyFitScore> findByProfileId(UUID profileId);
    List<CompanyFitScore> findByAssessmentResultId(UUID assessmentResultId);
    Optional<CompanyFitScore> findByAssessmentResultIdAndTargetCompanyAndTargetRole(UUID assessmentResultId, String targetCompany, String targetRole);
    boolean existsByAssessmentResultIdAndTargetCompanyAndTargetRole(UUID assessmentResultId, String targetCompany, String targetRole);
}
