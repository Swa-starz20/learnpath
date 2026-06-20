package com.learnpath.roadmap.entity;

import com.learnpath.skill.entity.Skill;
import jakarta.persistence.*;

/**
 * Maps skills to roadmap nodes (approved architecture: skill_id FK → skills.id).
 *
 * <p>Table: {@code roadmap_node_skills}
 */
@Entity
@Table(
    name = "roadmap_node_skills",
    indexes = {
        @Index(name = "idx_roadmap_node_skills_skill", columnList = "skill_id")
    }
)
@IdClass(RoadmapNodeSkillId.class)
public class RoadmapNodeSkill {

    @Id
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "roadmap_node_id", nullable = false)
    private RoadmapNode roadmapNode;

    @Id
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "skill_id", nullable = false)
    private Skill skill;

    protected RoadmapNodeSkill() {}

    public RoadmapNodeSkill(RoadmapNode roadmapNode, Skill skill) {
        this.roadmapNode = roadmapNode;
        this.skill = skill;
    }

    public RoadmapNode getRoadmapNode() { return roadmapNode; }
    public Skill getSkill() { return skill; }
}
