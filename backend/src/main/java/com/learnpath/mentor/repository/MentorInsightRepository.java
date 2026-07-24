package com.learnpath.mentor.repository;

import com.learnpath.mentor.entity.MentorInsight;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MentorInsightRepository extends JpaRepository<MentorInsight, UUID> {
    List<MentorInsight> findByUserIdOrderByGeneratedAtDesc(UUID userId);
    boolean existsByUserIdAndInsightTypeAndAssessmentResultId(UUID userId, String insightType, UUID assessmentResultId);
}
