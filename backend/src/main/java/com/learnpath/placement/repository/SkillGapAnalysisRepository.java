package com.learnpath.placement.repository;

import com.learnpath.placement.entity.SkillGapAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SkillGapAnalysisRepository extends JpaRepository<SkillGapAnalysis, UUID> {
    List<SkillGapAnalysis> findByProfileId(UUID profileId);
    List<SkillGapAnalysis> findByAssessmentResultId(UUID assessmentResultId);
    Optional<SkillGapAnalysis> findByAssessmentResultIdAndSkillId(UUID assessmentResultId, Long skillId);
    boolean existsByAssessmentResultIdAndSkillId(UUID assessmentResultId, Long skillId);
}
