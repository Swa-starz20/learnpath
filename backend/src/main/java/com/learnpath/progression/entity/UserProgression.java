package com.learnpath.progression.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

/**
 * Single source of truth for a user's learning progression.
 *
 * <p>Table: {@code user_progression}.
 * mastery_score exists ONLY here (approved architecture — no duplicate ownership).
 * user_id stored as plain UUID (no cross-module JPA association).
 */
@Entity
@Table(
    name = "user_progression",
    indexes = {
        @Index(name = "idx_user_progression_user", columnList = "user_id")
    }
)
public class UserProgression {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false, unique = true)
    private UUID userId;

    @Column(name = "total_xp", nullable = false)
    private Integer totalXp = 0;

    @Column(name = "mastery_score", nullable = false, precision = 5, scale = 2)
    private BigDecimal masteryScore = BigDecimal.ZERO;

    @Column(name = "streak_days", nullable = false)
    private Integer streakDays = 0;

    @Column(name = "last_activity_at")
    private Instant lastActivityAt;

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
    protected void onUpdate() { this.updatedAt = Instant.now(); }

    protected UserProgression() {}

    public static UserProgression createForUser(UUID userId) {
        UserProgression p = new UserProgression();
        p.userId = userId;
        return p;
    }

    public Long getId() { return id; }
    public UUID getUserId() { return userId; }
    public Integer getTotalXp() { return totalXp; }
    public BigDecimal getMasteryScore() { return masteryScore; }
    public Integer getStreakDays() { return streakDays; }
    public Instant getLastActivityAt() { return lastActivityAt; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }

    public void addXp(int xp) {
        if (xp < 0) throw new IllegalArgumentException("XP must be non-negative.");
        this.totalXp += xp;
        this.lastActivityAt = Instant.now();
    }

    public void setMasteryScore(BigDecimal masteryScore) {
        if (masteryScore.compareTo(BigDecimal.ZERO) < 0 || masteryScore.compareTo(new BigDecimal("100")) > 0) {
            throw new IllegalArgumentException("Mastery score must be between 0 and 100.");
        }
        this.masteryScore = masteryScore;
    }

    public void setStreakDays(Integer streakDays) { this.streakDays = streakDays; }
    public void setLastActivityAt(Instant lastActivityAt) { this.lastActivityAt = lastActivityAt; }
}
