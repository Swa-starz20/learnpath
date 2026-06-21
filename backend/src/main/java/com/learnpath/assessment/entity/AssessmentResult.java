package com.learnpath.assessment.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

/**
 * The final result of a submitted assessment session.
 *
 * <p>Table: {@code assessment_results}
 * Created exactly once per submitted session (UNIQUE on session_id).
 * score_percentage defaults to 0.00 — scoring engine is Phase 3B+.
 * user_id stored as plain UUID (no cross-module JPA association per architecture).
 */
@Entity
@Table(
    name = "assessment_results",
    indexes = {
        @Index(name = "idx_assessment_results_user",     columnList = "user_id"),
        @Index(name = "idx_assessment_results_template", columnList = "template_id"),
        @Index(name = "idx_assessment_results_session",  columnList = "session_id")
    }
)
public class AssessmentResult {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", columnDefinition = "UUID", updatable = false, nullable = false)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "session_id", nullable = false, unique = true)
    private AssessmentSession session;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "template_id", nullable = false)
    private AssessmentTemplate template;

    @Column(name = "score_percentage", nullable = false, precision = 5, scale = 2)
    private BigDecimal scorePercentage = BigDecimal.ZERO;

    @Column(name = "completed_at", nullable = false, updatable = false)
    private Instant completedAt;

    // ── Lifecycle ─────────────────────────────────────────────────────────────

    @PrePersist
    protected void onCreate() {
        this.completedAt = Instant.now();
    }

    // ── Constructors ──────────────────────────────────────────────────────────

    protected AssessmentResult() {}

    public AssessmentResult(AssessmentSession session, UUID userId,
                            AssessmentTemplate template) {
        this.session = session;
        this.userId = userId;
        this.template = template;
        this.scorePercentage = BigDecimal.ZERO;
    }

    // ── Getters ───────────────────────────────────────────────────────────────

    public UUID getId() { return id; }
    public AssessmentSession getSession() { return session; }
    public UUID getUserId() { return userId; }
    public AssessmentTemplate getTemplate() { return template; }
    public BigDecimal getScorePercentage() { return scorePercentage; }
    public Instant getCompletedAt() { return completedAt; }

    // ── Setters ───────────────────────────────────────────────────────────────

    public void setScorePercentage(BigDecimal scorePercentage) {
        this.scorePercentage = scorePercentage;
    }
}
