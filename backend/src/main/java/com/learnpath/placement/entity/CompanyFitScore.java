package com.learnpath.placement.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(
    name = "company_fit_scores",
    indexes = {
        @Index(name = "idx_company_fit_profile", columnList = "profile_id"),
        @Index(name = "idx_company_fit_result",  columnList = "assessment_result_id")
    },
    uniqueConstraints = {
        @UniqueConstraint(name = "uq_company_fit_unique", columnNames = {"assessment_result_id", "target_company", "target_role"})
    }
)
public class CompanyFitScore {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "profile_id", nullable = false)
    private PlacementProfile profile;

    @Column(name = "assessment_result_id", nullable = false)
    private UUID assessmentResultId;

    @Column(name = "target_company", nullable = false, length = 255)
    private String targetCompany;

    @Column(name = "target_role", nullable = false, length = 255)
    private String targetRole;

    @Column(name = "fit_score", nullable = false)
    private int fitScore;

    @Column(name = "confidence_level", nullable = false, length = 50)
    private String confidenceLevel;

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

    public CompanyFitScore() {
    }

    public CompanyFitScore(PlacementProfile profile, UUID assessmentResultId, String targetCompany, String targetRole, int fitScore, String confidenceLevel) {
        this.profile = profile;
        this.assessmentResultId = assessmentResultId;
        this.targetCompany = targetCompany;
        this.targetRole = targetRole;
        this.fitScore = fitScore;
        this.confidenceLevel = confidenceLevel;
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

    public String getTargetCompany() {
        return targetCompany;
    }

    public void setTargetCompany(String targetCompany) {
        this.targetCompany = targetCompany;
    }

    public String getTargetRole() {
        return targetRole;
    }

    public void setTargetRole(String targetRole) {
        this.targetRole = targetRole;
    }

    public int getFitScore() {
        return fitScore;
    }

    public void setFitScore(int fitScore) {
        this.fitScore = fitScore;
    }

    public String getConfidenceLevel() {
        return confidenceLevel;
    }

    public void setConfidenceLevel(String confidenceLevel) {
        this.confidenceLevel = confidenceLevel;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }
}
