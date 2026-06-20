package com.learnpath.roadmap.entity;

import jakarta.persistence.*;

import java.time.Instant;

/**
 * A single topic/milestone node within a career track.
 *
 * <p>Table: {@code roadmap_nodes}
 */
@Entity
@Table(
    name = "roadmap_nodes",
    indexes = {
        @Index(name = "idx_roadmap_nodes_track_id", columnList = "career_track_id"),
        @Index(name = "idx_roadmap_nodes_order",    columnList = "career_track_id, order_index")
    }
)
public class RoadmapNode {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "career_track_id", nullable = false)
    private CareerTrack careerTrack;

    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "node_type", nullable = false, length = 30)
    private String nodeType = "TOPIC";

    @Column(name = "order_index", nullable = false)
    private Integer orderIndex = 0;

    @Column(name = "estimated_hours")
    private Integer estimatedHours;

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

    protected RoadmapNode() {}

    public RoadmapNode(CareerTrack careerTrack, String title, String description,
                       String nodeType, Integer orderIndex, Integer estimatedHours) {
        this.careerTrack = careerTrack;
        this.title = title;
        this.description = description;
        this.nodeType = nodeType;
        this.orderIndex = orderIndex;
        this.estimatedHours = estimatedHours;
    }

    public Long getId() { return id; }
    public CareerTrack getCareerTrack() { return careerTrack; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getNodeType() { return nodeType; }
    public Integer getOrderIndex() { return orderIndex; }
    public Integer getEstimatedHours() { return estimatedHours; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }

    public void setTitle(String title) { this.title = title; }
    public void setDescription(String description) { this.description = description; }
    public void setNodeType(String nodeType) { this.nodeType = nodeType; }
    public void setOrderIndex(Integer orderIndex) { this.orderIndex = orderIndex; }
    public void setEstimatedHours(Integer estimatedHours) { this.estimatedHours = estimatedHours; }
}
