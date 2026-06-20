package com.learnpath.roadmap.entity;

import jakarta.persistence.*;

import java.time.Instant;

/**
 * A directed edge between two roadmap nodes (prerequisite relationship).
 *
 * <p>Table: {@code roadmap_edges}
 */
@Entity
@Table(
    name = "roadmap_edges",
    indexes = {
        @Index(name = "idx_roadmap_edges_track",  columnList = "career_track_id"),
        @Index(name = "idx_roadmap_edges_source", columnList = "source_node_id"),
        @Index(name = "idx_roadmap_edges_target", columnList = "target_node_id")
    },
    uniqueConstraints = {
        @UniqueConstraint(name = "uq_roadmap_edge", columnNames = {"source_node_id", "target_node_id"})
    }
)
public class RoadmapEdge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "career_track_id", nullable = false)
    private CareerTrack careerTrack;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "source_node_id", nullable = false)
    private RoadmapNode sourceNode;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "target_node_id", nullable = false)
    private RoadmapNode targetNode;

    @Column(name = "edge_type", nullable = false, length = 30)
    private String edgeType = "PREREQUISITE";

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @PrePersist
    protected void onCreate() { this.createdAt = Instant.now(); }

    protected RoadmapEdge() {}

    public RoadmapEdge(CareerTrack careerTrack, RoadmapNode sourceNode,
                       RoadmapNode targetNode, String edgeType) {
        this.careerTrack = careerTrack;
        this.sourceNode = sourceNode;
        this.targetNode = targetNode;
        this.edgeType = edgeType;
    }

    public Long getId() { return id; }
    public CareerTrack getCareerTrack() { return careerTrack; }
    public RoadmapNode getSourceNode() { return sourceNode; }
    public RoadmapNode getTargetNode() { return targetNode; }
    public String getEdgeType() { return edgeType; }
    public Instant getCreatedAt() { return createdAt; }
}
