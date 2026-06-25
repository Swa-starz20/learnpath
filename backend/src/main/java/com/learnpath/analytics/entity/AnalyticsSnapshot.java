package com.learnpath.analytics.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "analytics_snapshots")
public class AnalyticsSnapshot {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "overall_progress", nullable = false, precision = 5, scale = 2)
    private BigDecimal overallProgress = BigDecimal.ZERO;

    @Column(name = "roadmap_completion", nullable = false, precision = 5, scale = 2)
    private BigDecimal roadmapCompletion = BigDecimal.ZERO;

    @Column(name = "assessment_average", nullable = false, precision = 5, scale = 2)
    private BigDecimal assessmentAverage = BigDecimal.ZERO;

    @Column(name = "readiness_score", nullable = false, precision = 5, scale = 2)
    private BigDecimal readinessScore = BigDecimal.ZERO;

    @Column(name = "total_xp", nullable = false)
    private Integer totalXp = 0;

    @Column(name = "mastery_score", nullable = false, precision = 5, scale = 2)
    private BigDecimal masteryScore = BigDecimal.ZERO;

    @Column(name = "snapshot_time", nullable = false)
    private Instant snapshotTime;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @PrePersist
    protected void onCreate() {
        Instant now = Instant.now();
        this.createdAt = now;
        this.updatedAt = now;
        if (this.snapshotTime == null) {
            this.snapshotTime = now;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = Instant.now();
    }

    public AnalyticsSnapshot() {}

    public AnalyticsSnapshot(UUID userId, BigDecimal overallProgress, BigDecimal roadmapCompletion,
                             BigDecimal assessmentAverage, BigDecimal readinessScore, Integer totalXp,
                             BigDecimal masteryScore) {
        this.userId = userId;
        this.overallProgress = overallProgress;
        this.roadmapCompletion = roadmapCompletion;
        this.assessmentAverage = assessmentAverage;
        this.readinessScore = readinessScore;
        this.totalXp = totalXp;
        this.masteryScore = masteryScore;
        this.snapshotTime = Instant.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }

    public BigDecimal getOverallProgress() { return overallProgress; }
    public void setOverallProgress(BigDecimal overallProgress) { this.overallProgress = overallProgress; }

    public BigDecimal getRoadmapCompletion() { return roadmapCompletion; }
    public void setRoadmapCompletion(BigDecimal roadmapCompletion) { this.roadmapCompletion = roadmapCompletion; }

    public BigDecimal getAssessmentAverage() { return assessmentAverage; }
    public void setAssessmentAverage(BigDecimal assessmentAverage) { this.assessmentAverage = assessmentAverage; }

    public BigDecimal getReadinessScore() { return readinessScore; }
    public void setReadinessScore(BigDecimal readinessScore) { this.readinessScore = readinessScore; }

    public Integer getTotalXp() { return totalXp; }
    public void setTotalXp(Integer totalXp) { this.totalXp = totalXp; }

    public BigDecimal getMasteryScore() { return masteryScore; }
    public void setMasteryScore(BigDecimal masteryScore) { this.masteryScore = masteryScore; }

    public Instant getSnapshotTime() { return snapshotTime; }
    public void setSnapshotTime(Instant snapshotTime) { this.snapshotTime = snapshotTime; }

    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}
