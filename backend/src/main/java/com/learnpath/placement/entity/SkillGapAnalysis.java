package com.learnpath.placement.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(
    name = "skill_gap_analysis",
    indexes = {
        @Index(name = "idx_skill_gap_profile", columnList = "profile_id"),
        @Index(name = "idx_skill_gap_result",  columnList = "assessment_result_id"),
        @Index(name = "idx_skill_gap_skill",   columnList = "skill_id")
    },
    uniqueConstraints = {
        @UniqueConstraint(name = "uq_skill_gap_unique", columnNames = {"assessment_result_id", "skill_id"})
    }
)
public class SkillGapAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "profile_id", nullable = false)
    private PlacementProfile profile;

    @Column(name = "assessment_result_id", nullable = false)
    private UUID assessmentResultId;

    @Column(name = "skill_id", nullable = false)
    private Long skillId;

    @Column(name = "skill_name", nullable = false, length = 100)
    private String skillName;

    @Column(name = "gap_type", nullable = false, length = 50)
    private String gapType;

    @Column(name = "severity", nullable = false, length = 50)
    private String severity;

    @Column(name = "recommended_action", nullable = false, length = 255)
    private String recommendedAction;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @PrePersist
    protected void onCreate() {
        Instant now = Instant.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = Instant.now();
    }

    public SkillGapAnalysis() {
    }

    public SkillGapAnalysis(PlacementProfile profile, UUID assessmentResultId, Long skillId, String skillName, String gapType, String severity, String recommendedAction) {
        this.profile = profile;
        this.assessmentResultId = assessmentResultId;
        this.skillId = skillId;
        this.skillName = skillName;
        this.gapType = gapType;
        this.severity = severity;
        this.recommendedAction = recommendedAction;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public PlacementProfile getProfile() {
        return profile;
    }

    public void setProfile(PlacementProfile profile) {
        this.profile = profile;
    }

    public UUID getAssessmentResultId() {
        return assessmentResultId;
    }

    public void setAssessmentResultId(UUID assessmentResultId) {
        this.assessmentResultId = assessmentResultId;
    }

    public Long getSkillId() {
        return skillId;
    }

    public void setSkillId(Long skillId) {
        this.skillId = skillId;
    }

    public String getSkillName() {
        return skillName;
    }

    public void setSkillName(String skillName) {
        this.skillName = skillName;
    }

    public String getGapType() {
        return gapType;
    }

    public void setGapType(String gapType) {
        this.gapType = gapType;
    }

    public String getSeverity() {
        return severity;
    }

    public void setSeverity(String severity) {
        this.severity = severity;
    }

    public String getRecommendedAction() {
        return recommendedAction;
    }

    public void setRecommendedAction(String recommendedAction) {
        this.recommendedAction = recommendedAction;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }
}
