package com.learnpath.roadmap.entity;

import java.io.Serializable;
import java.util.Objects;

/**
 * Composite primary key for {@link RoadmapNodeSkill}.
 */
public class RoadmapNodeSkillId implements Serializable {

    private Long roadmapNode;
    private Long skill;

    public RoadmapNodeSkillId() {}

    public RoadmapNodeSkillId(Long roadmapNode, Long skill) {
        this.roadmapNode = roadmapNode;
        this.skill = skill;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof RoadmapNodeSkillId that)) return false;
        return Objects.equals(roadmapNode, that.roadmapNode) && Objects.equals(skill, that.skill);
    }

    @Override
    public int hashCode() { return Objects.hash(roadmapNode, skill); }

    public Long getRoadmapNode() { return roadmapNode; }
    public Long getSkill() { return skill; }
    public void setRoadmapNode(Long roadmapNode) { this.roadmapNode = roadmapNode; }
    public void setSkill(Long skill) { this.skill = skill; }
}
