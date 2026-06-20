package com.learnpath.roadmap.repository;

import com.learnpath.roadmap.entity.RoadmapEdge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoadmapEdgeRepository extends JpaRepository<RoadmapEdge, Long> {
    List<RoadmapEdge> findByCareerTrackId(Long careerTrackId);
    List<RoadmapEdge> findBySourceNodeId(Long sourceNodeId);
}
