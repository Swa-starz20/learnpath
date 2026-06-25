package com.learnpath.placement.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(
    name = "placement_readiness",
    indexes = {
        @Index(name = "idx_placement_readiness_profile", columnList = "profile_id"),
        @Index(name = "idx_placement_readiness_result",  columnList = "assessment_result_id")
    }
)
public class PlacementReadiness {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "profile_id", nullable = false)
    private PlacementProfile profile;

    @Column(name = "assessment_result_id", nullable = false, unique = true)
    private UUID assessmentResultId;

    @Column(name = "readiness_score", nullable = false, precision = 5, scale = 2)
    private BigDecimal readinessScore = BigDecimal.ZERO;

    @Column(name = "technical_score", nullable = false, precision = 5, scale = 2)
    private BigDecimal technicalScore = BigDecimal.ZERO;

    @Column(name = "aptitude_score", nullable = false, precision = 5, scale = 2)
    private BigDecimal aptitudeScore = BigDecimal.ZERO;

    @Column(name = "communication_score", nullable = false, precision = 5, scale = 2)
    private BigDecimal communicationScore = BigDecimal.ZERO;

    @Column(name = "behavioral_score", nullable = false, precision = 5, scale = 2)
    private BigDecimal behavioralScore = BigDecimal.ZERO;

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

    public PlacementReadiness() {
    }

    public PlacementReadiness(PlacementProfile profile, UUID assessmentResultId) {
        this.profile = profile;
        this.assessmentResultId = assessmentResultId;
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

    public BigDecimal getReadinessScore() {
        return readinessScore;
    }

    public void setReadinessScore(BigDecimal readinessScore) {
        this.readinessScore = readinessScore;
    }

    public BigDecimal getTechnicalScore() {
        return technicalScore;
    }

    public void setTechnicalScore(BigDecimal technicalScore) {
        this.technicalScore = technicalScore;
    }

    public BigDecimal getAptitudeScore() {
        return aptitudeScore;
    }

    public void setAptitudeScore(BigDecimal aptitudeScore) {
        this.aptitudeScore = aptitudeScore;
    }

    public BigDecimal getCommunicationScore() {
        return communicationScore;
    }

    public void setCommunicationScore(BigDecimal communicationScore) {
        this.communicationScore = communicationScore;
    }

    public BigDecimal getBehavioralScore() {
        return behavioralScore;
    }

    public void setBehavioralScore(BigDecimal behavioralScore) {
        this.behavioralScore = behavioralScore;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }
}
