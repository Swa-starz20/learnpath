package com.learnpath.roadmap.repository;

import com.learnpath.roadmap.entity.RoadmapNodeSkill;
import com.learnpath.roadmap.entity.RoadmapNodeSkillId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoadmapNodeSkillRepository extends JpaRepository<RoadmapNodeSkill, RoadmapNodeSkillId> {
    List<RoadmapNodeSkill> findByRoadmapNodeId(Long roadmapNodeId);
}
