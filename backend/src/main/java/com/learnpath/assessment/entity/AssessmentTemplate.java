package com.learnpath.assessment.entity;

import com.learnpath.domain.entity.Domain;
import jakarta.persistence.*;

import java.time.Instant;
import java.util.UUID;

/**
 * Assessment template — the reusable blueprint for an assessment.
 *
 * <p>Table: {@code assessment_templates}
 * A template defines the structure, type, and domain of an assessment.
 * Actual question content is stored in {@link AssessmentQuestion}.
 */
@Entity
@Table(
    name = "assessment_templates",
    indexes = {
        @Index(name = "idx_assessment_templates_domain",    columnList = "domain_id"),
        @Index(name = "idx_assessment_templates_is_active", columnList = "is_active"),
        @Index(name = "idx_assessment_templates_type",      columnList = "assessment_type")
    }
)
public class AssessmentTemplate {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", columnDefinition = "UUID", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "code", nullable = false, unique = true, length = 100)
    private String code;

    @Column(name = "name", nullable = false, length = 200)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "assessment_type", nullable = false, length = 50)
    private String assessmentType = "QUIZ";

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "domain_id", nullable = false)
    private Domain domain;

    @Column(name = "duration_minutes")
    private Integer durationMinutes;

    @Column(name = "total_questions", nullable = false)
    private Integer totalQuestions = 0;

    @Column(name = "is_active", nullable = false)
    private boolean active = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    // ── Lifecycle ─────────────────────────────────────────────────────────────

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

    // ── Constructors ──────────────────────────────────────────────────────────

    protected AssessmentTemplate() {}

    public AssessmentTemplate(String code, String name, String description,
                              String assessmentType, Domain domain,
                              Integer durationMinutes, Integer totalQuestions) {
        this.code = code;
        this.name = name;
        this.description = description;
        this.assessmentType = assessmentType;
        this.domain = domain;
        this.durationMinutes = durationMinutes;
        this.totalQuestions = totalQuestions != null ? totalQuestions : 0;
    }

    // ── Getters ───────────────────────────────────────────────────────────────

    public UUID getId() { return id; }
    public String getCode() { return code; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public String getAssessmentType() { return assessmentType; }
    public Domain getDomain() { return domain; }
    public Integer getDurationMinutes() { return durationMinutes; }
    public Integer getTotalQuestions() { return totalQuestions; }
    public boolean isActive() { return active; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }

    // ── Setters ───────────────────────────────────────────────────────────────

    public void setName(String name) { this.name = name; }
    public void setDescription(String description) { this.description = description; }
    public void setAssessmentType(String assessmentType) { this.assessmentType = assessmentType; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }
    public void setTotalQuestions(Integer totalQuestions) { this.totalQuestions = totalQuestions; }
    public void setActive(boolean active) { this.active = active; }
    public void setDomain(Domain domain) { this.domain = domain; }
}
