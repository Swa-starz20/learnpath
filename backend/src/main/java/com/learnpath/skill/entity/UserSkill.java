package com.learnpath.skill.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

/**
 * Tracks a specific user's relationship with a skill — confidence and mastery level.
 *
 * <p>Table: {@code user_skills}. UNIQUE(user_id, skill_id) prevents duplicates.
 * user_id is stored as a plain UUID (no cross-module JPA association).
 */
@Entity
@Table(
    name = "user_skills",
    indexes = {
        @Index(name = "idx_user_skills_user_id",  columnList = "user_id"),
        @Index(name = "idx_user_skills_skill_id", columnList = "skill_id")
    },
    uniqueConstraints = {
        @UniqueConstraint(name = "uq_user_skill", columnNames = {"user_id", "skill_id"})
    }
)
public class UserSkill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "skill_id", nullable = false)
    private Skill skill;

    @Column(name = "confidence_score", nullable = false, precision = 5, scale = 2)
    private BigDecimal confidenceScore = BigDecimal.ZERO;

    @Column(name = "mastery_level", nullable = false, length = 20)
    private String masteryLevel = "BEGINNER";

    @Column(name = "last_assessed_at")
    private Instant lastAssessedAt;

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

    protected UserSkill() {}

    public UserSkill(UUID userId, Skill skill) {
        this.userId = userId;
        this.skill = skill;
    }

    public Long getId() { return id; }
    public UUID getUserId() { return userId; }
    public Skill getSkill() { return skill; }
    public BigDecimal getConfidenceScore() { return confidenceScore; }
    public String getMasteryLevel() { return masteryLevel; }
    public Instant getLastAssessedAt() { return lastAssessedAt; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }

    public void setConfidenceScore(BigDecimal confidenceScore) { this.confidenceScore = confidenceScore; }
    public void setMasteryLevel(String masteryLevel) { this.masteryLevel = masteryLevel; }
    public void setLastAssessedAt(Instant lastAssessedAt) { this.lastAssessedAt = lastAssessedAt; }
}
