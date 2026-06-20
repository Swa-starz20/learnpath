package com.learnpath.course.entity;

import com.learnpath.domain.entity.Domain;
import com.learnpath.roadmap.entity.CareerTrack;
import jakarta.persistence.*;

import java.time.Instant;

/**
 * A course in the learning catalog.
 *
 * <p>Table: {@code courses}
 */
@Entity
@Table(
    name = "courses",
    indexes = {
        @Index(name = "idx_courses_domain_id",    columnList = "domain_id"),
        @Index(name = "idx_courses_slug",          columnList = "slug"),
        @Index(name = "idx_courses_is_published",  columnList = "is_published"),
        @Index(name = "idx_courses_track_id",      columnList = "career_track_id")
    }
)
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "domain_id", nullable = false)
    private Domain domain;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "career_track_id")
    private CareerTrack careerTrack;

    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "slug", nullable = false, unique = true, length = 200)
    private String slug;

    @Column(name = "difficulty_level", nullable = false, length = 20)
    private String difficultyLevel = "BEGINNER";

    @Column(name = "estimated_hours")
    private Integer estimatedHours;

    @Column(name = "is_published", nullable = false)
    private boolean published = false;

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

    protected Course() {}

    public Course(Domain domain, CareerTrack careerTrack, String title, String description,
                  String slug, String difficultyLevel, Integer estimatedHours) {
        this.domain = domain;
        this.careerTrack = careerTrack;
        this.title = title;
        this.description = description;
        this.slug = slug;
        this.difficultyLevel = difficultyLevel;
        this.estimatedHours = estimatedHours;
    }

    public Long getId() { return id; }
    public Domain getDomain() { return domain; }
    public CareerTrack getCareerTrack() { return careerTrack; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getSlug() { return slug; }
    public String getDifficultyLevel() { return difficultyLevel; }
    public Integer getEstimatedHours() { return estimatedHours; }
    public boolean isPublished() { return published; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }

    public void setTitle(String title) { this.title = title; }
    public void setDescription(String description) { this.description = description; }
    public void setDifficultyLevel(String difficultyLevel) { this.difficultyLevel = difficultyLevel; }
    public void setEstimatedHours(Integer estimatedHours) { this.estimatedHours = estimatedHours; }
    public void setPublished(boolean published) { this.published = published; }
    public void setCareerTrack(CareerTrack careerTrack) { this.careerTrack = careerTrack; }
}
