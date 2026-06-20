package com.learnpath.roadmap.entity;

import jakarta.persistence.*;

import java.time.Instant;
import java.util.UUID;

/**
 * Tracks a user's progress through individual roadmap nodes.
 *
 * <p>Table: {@code user_roadmap_progress}. UNIQUE(user_id, roadmap_node_id).
 * user_id stored as plain UUID (no cross-module JPA association).
 */
@Entity
@Table(
    name = "user_roadmap_progress",
    indexes = {
        @Index(name = "idx_user_roadmap_progress_user",  columnList = "user_id"),
        @Index(name = "idx_user_roadmap_progress_track", columnList = "career_track_id"),
        @Index(name = "idx_user_roadmap_progress_node",  columnList = "roadmap_node_id")
    },
    uniqueConstraints = {
        @UniqueConstraint(name = "uq_user_roadmap_node", columnNames = {"user_id", "roadmap_node_id"})
    }
)
public class UserRoadmapProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "career_track_id", nullable = false)
    private CareerTrack careerTrack;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "roadmap_node_id", nullable = false)
    private RoadmapNode roadmapNode;

    @Column(name = "status", nullable = false, length = 20)
    private String status = "NOT_STARTED";

    @Column(name = "completed_at")
    private Instant completedAt;

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

    protected UserRoadmapProgress() {}

    public UserRoadmapProgress(UUID userId, CareerTrack careerTrack, RoadmapNode roadmapNode) {
        this.userId = userId;
        this.careerTrack = careerTrack;
        this.roadmapNode = roadmapNode;
    }

    public Long getId() { return id; }
    public UUID getUserId() { return userId; }
    public CareerTrack getCareerTrack() { return careerTrack; }
    public RoadmapNode getRoadmapNode() { return roadmapNode; }
    public String getStatus() { return status; }
    public Instant getCompletedAt() { return completedAt; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }

    public void setStatus(String status) { this.status = status; }
    public void setCompletedAt(Instant completedAt) { this.completedAt = completedAt; }
}
