package com.learnpath.mentor.repository;

import com.learnpath.mentor.entity.MentorRecommendation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MentorRecommendationRepository extends JpaRepository<MentorRecommendation, UUID> {
    List<MentorRecommendation> findByUserIdOrderByCreatedAtDesc(UUID userId);
    boolean existsByUserIdAndRecommendationTypeAndCompletedFalse(UUID userId, String recommendationType);
    List<MentorRecommendation> findByUserIdAndTitleContainingIgnoreCaseOrUserIdAndDescriptionContainingIgnoreCase(UUID userId1, String title, UUID userId2, String description);
}
