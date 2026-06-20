package com.learnpath.roadmap.repository;

import com.learnpath.roadmap.entity.RoadmapNode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoadmapNodeRepository extends JpaRepository<RoadmapNode, Long> {
    List<RoadmapNode> findByCareerTrackIdOrderByOrderIndexAsc(Long careerTrackId);
}
