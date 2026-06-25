package com.learnpath.roadmap.repository;

import com.learnpath.roadmap.entity.UserRoadmapProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRoadmapProgressRepository extends JpaRepository<UserRoadmapProgress, Long> {
    List<UserRoadmapProgress> findByUserId(UUID userId);
    List<UserRoadmapProgress> findByUserIdAndCareerTrackId(UUID userId, Long careerTrackId);
    Optional<UserRoadmapProgress> findByUserIdAndRoadmapNodeId(UUID userId, Long roadmapNodeId);
    long countByUserIdAndCareerTrackIdAndStatus(UUID userId, Long careerTrackId, String status);
}
