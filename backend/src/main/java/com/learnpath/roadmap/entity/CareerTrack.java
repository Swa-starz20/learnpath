package com.learnpath.roadmap.entity;

import com.learnpath.domain.entity.Domain;
import jakarta.persistence.*;

import java.time.Instant;

/**
 * A structured career learning path within an engineering domain.
 *
 * <p>Table: {@code career_tracks}
 */
@Entity
@Table(
    name = "career_tracks",
    indexes = {
        @Index(name = "idx_career_tracks_domain_id", columnList = "domain_id"),
        @Index(name = "idx_career_tracks_is_active",  columnList = "is_active")
    }
)
public class CareerTrack {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "domain_id", nullable = false)
    private Domain domain;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "difficulty_level", nullable = false, length = 20)
    private String difficultyLevel = "INTERMEDIATE";

    @Column(name = "estimated_duration_weeks")
    private Integer estimatedDurationWeeks;

    @Column(name = "is_active", nullable = false)
    private boolean active = true;

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

    protected CareerTrack() {}

    public CareerTrack(Domain domain, String name, String description,
                       String difficultyLevel, Integer estimatedDurationWeeks) {
        this.domain = domain;
        this.name = name;
        this.description = description;
        this.difficultyLevel = difficultyLevel;
        this.estimatedDurationWeeks = estimatedDurationWeeks;
    }

    public Long getId() { return id; }
    public Domain getDomain() { return domain; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public String getDifficultyLevel() { return difficultyLevel; }
    public Integer getEstimatedDurationWeeks() { return estimatedDurationWeeks; }
    public boolean isActive() { return active; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }

    public void setName(String name) { this.name = name; }
    public void setDescription(String description) { this.description = description; }
    public void setDifficultyLevel(String difficultyLevel) { this.difficultyLevel = difficultyLevel; }
    public void setEstimatedDurationWeeks(Integer estimatedDurationWeeks) { this.estimatedDurationWeeks = estimatedDurationWeeks; }
    public void setActive(boolean active) { this.active = active; }
}
