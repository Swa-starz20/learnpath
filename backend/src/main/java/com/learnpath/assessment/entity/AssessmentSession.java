package com.learnpath.assessment.entity;

import jakarta.persistence.*;

import java.time.Instant;
import java.util.UUID;

/**
 * An active or completed assessment attempt by a user.
 *
 * <p>Table: {@code assessment_sessions}
 * Business rules enforced:
 * <ul>
 *   <li>Only one IN_PROGRESS session per (user_id, template_id) — enforced by partial unique index</li>
 *   <li>Status transitions: IN_PROGRESS → SUBMITTED or IN_PROGRESS → EXPIRED</li>
 *   <li>Answers cannot be recorded after submission</li>
 * </ul>
 * user_id is stored as plain UUID (no cross-module JPA association per architecture).
 */
@Entity
@Table(
    name = "assessment_sessions",
    indexes = {
        @Index(name = "idx_assessment_sessions_user",          columnList = "user_id"),
        @Index(name = "idx_assessment_sessions_template",      columnList = "template_id"),
        @Index(name = "idx_assessment_sessions_user_template", columnList = "user_id, template_id"),
        @Index(name = "idx_assessment_sessions_status",        columnList = "status")
    }
)
public class AssessmentSession {

    public static final String STATUS_IN_PROGRESS = "IN_PROGRESS";
    public static final String STATUS_SUBMITTED    = "SUBMITTED";
    public static final String STATUS_EXPIRED      = "EXPIRED";

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", columnDefinition = "UUID", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "template_id", nullable = false)
    private AssessmentTemplate template;

    @Column(name = "status", nullable = false, length = 30)
    private String status = STATUS_IN_PROGRESS;

    @Column(name = "started_at", nullable = false, updatable = false)
    private Instant startedAt;

    @Column(name = "submitted_at")
    private Instant submittedAt;

    @Column(name = "time_spent_seconds")
    private Integer timeSpentSeconds;

    // ── Lifecycle ─────────────────────────────────────────────────────────────

    @PrePersist
    protected void onCreate() {
        this.startedAt = Instant.now();
    }

    // ── Constructors ──────────────────────────────────────────────────────────

    protected AssessmentSession() {}

    public AssessmentSession(UUID userId, AssessmentTemplate template) {
        this.userId = userId;
        this.template = template;
        this.status = STATUS_IN_PROGRESS;
    }

    // ── Domain behaviour ──────────────────────────────────────────────────────

    /** Returns true if this session is still accepting answers. */
    public boolean isInProgress() {
        return STATUS_IN_PROGRESS.equals(this.status);
    }

    /** Returns true if this session has been submitted. */
    public boolean isSubmitted() {
        return STATUS_SUBMITTED.equals(this.status);
    }

    /** Marks the session as submitted. Idempotent if already submitted. */
    public void submit(int timeSpentSeconds) {
        if (!isInProgress()) {
            throw new IllegalStateException("Session is not in progress.");
        }
        this.status = STATUS_SUBMITTED;
        this.submittedAt = Instant.now();
        this.timeSpentSeconds = timeSpentSeconds;
    }

    // ── Getters ───────────────────────────────────────────────────────────────

    public UUID getId() { return id; }
    public UUID getUserId() { return userId; }
    public AssessmentTemplate getTemplate() { return template; }
    public String getStatus() { return status; }
    public Instant getStartedAt() { return startedAt; }
    public Instant getSubmittedAt() { return submittedAt; }
    public Integer getTimeSpentSeconds() { return timeSpentSeconds; }
}
