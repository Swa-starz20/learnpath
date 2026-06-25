package com.learnpath.placement.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(
    name = "placement_recommendations",
    indexes = {
        @Index(name = "idx_placement_recs_user",    columnList = "user_id"),
        @Index(name = "idx_placement_recs_profile", columnList = "profile_id"),
        @Index(name = "idx_placement_recs_result",  columnList = "assessment_result_id")
    }
)
public class PlacementRecommendation {

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

    @Column(name = "recommendation_type", nullable = false, length = 50)
    private String recommendationType;

    @Column(name = "title", nullable = false, length = 255)
    private String title;

    @Column(name = "description", nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "action_url", length = 255)
    private String actionUrl;

    @Column(name = "is_active", nullable = false)
    private boolean active = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "insight_id")
    private PlacementInsight insight;

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

    public PlacementRecommendation() {
    }

    public PlacementRecommendation(UUID userId, PlacementProfile profile, UUID assessmentResultId, String recommendationType, String title, String description, String actionUrl) {
        this.userId = userId;
        this.profile = profile;
        this.assessmentResultId = assessmentResultId;
        this.recommendationType = recommendationType;
        this.title = title;
        this.description = description;
        this.actionUrl = actionUrl;
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

    public String getRecommendationType() {
        return recommendationType;
    }

    public void setRecommendationType(String recommendationType) {
        this.recommendationType = recommendationType;
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

    public String getActionUrl() {
        return actionUrl;
    }

    public void setActionUrl(String actionUrl) {
        this.actionUrl = actionUrl;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public PlacementInsight getInsight() {
        return insight;
    }

    public void setInsight(PlacementInsight insight) {
        this.insight = insight;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }
}
