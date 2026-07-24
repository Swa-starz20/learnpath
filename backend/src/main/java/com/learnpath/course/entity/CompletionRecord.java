package com.learnpath.course.entity;

import jakarta.persistence.*;

import java.time.Instant;
import java.util.UUID;

/**
 * Records a user completing a course entity (lesson, module, or course).
 *
 * <p>Table: {@code completion_records}.
 * UNIQUE(user_id, entity_type, entity_id) prevents duplicate completions.
 * user_id stored as plain UUID (no cross-module JPA association).
 */
@Entity
@Table(
    name = "completion_records",
    indexes = {
        @Index(name = "idx_completion_records_user",   columnList = "user_id"),
        @Index(name = "idx_completion_records_entity", columnList = "entity_type, entity_id")
    },
    uniqueConstraints = {
        @UniqueConstraint(name = "uq_completion", columnNames = {"user_id", "entity_type", "entity_id"})
    }
)
public class CompletionRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "entity_type", nullable = false, length = 30)
    private String entityType;

    @Column(name = "entity_id", nullable = false)
    private Long entityId;

    @Column(name = "completed_at", nullable = false)
    private Instant completedAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = Instant.now();
        if (this.completedAt == null) this.completedAt = Instant.now();
    }

    protected CompletionRecord() {}

    public CompletionRecord(UUID userId, String entityType, Long entityId) {
        this.userId = userId;
        this.entityType = entityType;
        this.entityId = entityId;
        this.completedAt = Instant.now();
    }

    public Long getId() { return id; }
    public UUID getUserId() { return userId; }
    public String getEntityType() { return entityType; }
    public Long getEntityId() { return entityId; }
    public Instant getCompletedAt() { return completedAt; }
    public Instant getCreatedAt() { return createdAt; }
}
