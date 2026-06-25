package com.learnpath.placement.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(
    name = "placement_insights",
    indexes = {
        @Index(name = "idx_placement_insights_user",         columnList = "user_id"),
        @Index(name = "idx_placement_insights_profile",      columnList = "profile_id"),
        @Index(name = "idx_placement_insights_result",       columnList = "assessment_result_id")
    },
    uniqueConstraints = {
        @UniqueConstraint(name = "uq_placement_insight_unique", columnNames = {"assessment_result_id", "category", "insight_type"})
    }
)
public class PlacementInsight {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "profile_id", nullable = false)
    private PlacementProfile profile;

    @Column(name = "assessment_result_id", nullable = false)
    private UUID assessmentResultId;

    @Column(name = "insight_type", nullable = false, length = 50)
    private String insightType;

    @Column(name = "category", nullable = false, length = 50)
    private String category;

    @Column(name = "title", nullable = false, length = 255)
    private String title;

    @Column(name = "description", nullable = false, columnDefinition = "TEXT")
    private String description;

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

    public PlacementInsight() {
    }

    public PlacementInsight(UUID userId, PlacementProfile profile, UUID assessmentResultId, String insightType, String category, String title, String description) {
        this.userId = userId;
        this.profile = profile;
        this.assessmentResultId = assessmentResultId;
        this.insightType = insightType;
        this.category = category;
        this.title = title;
        this.description = description;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
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

    public String getInsightType() {
        return insightType;
    }

    public void setInsightType(String insightType) {
        this.insightType = insightType;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }
}
