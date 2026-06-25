package com.learnpath.analytics.repository;

import com.learnpath.analytics.entity.LearningStreak;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface LearningStreakRepository extends JpaRepository<LearningStreak, UUID> {
    Optional<LearningStreak> findByUserId(UUID userId);
}
