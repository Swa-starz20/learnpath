package com.learnpath.assessment.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

/**
 * Breakdown of assessment category scores for a user's completed assessment.
 *
 * <p>Table: {@code assessment_metrics}
 */
@Entity
@Table(
    name = "assessment_metrics",
    indexes = {
        @Index(name = "idx_assessment_metrics_user",     columnList = "user_id"),
        @Index(name = "idx_assessment_metrics_template", columnList = "template_id")
    }
)
public class AssessmentMetric {

    @Id
    @Column(name = "id", columnDefinition = "UUID", updatable = false, nullable = false)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "assessment_result_id", nullable = false, unique = true)
    private AssessmentResult assessmentResult;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "template_id", nullable = false)
    private AssessmentTemplate template;

    @Column(name = "technical_score", precision = 5, scale = 2)
    private BigDecimal technicalScore;

    @Column(name = "aptitude_score", precision = 5, scale = 2)
    private BigDecimal aptitudeScore;

    @Column(name = "behavioral_score", precision = 5, scale = 2)
    private BigDecimal behavioralScore;

    @Column(name = "communication_score", precision = 5, scale = 2)
    private BigDecimal communicationScore;

    @Column(name = "domain_readiness_score", precision = 5, scale = 2)
    private BigDecimal domainReadinessScore;

    @Column(name = "overall_score", precision = 5, scale = 2)
    private BigDecimal overallScore;

    @Column(name = "computed_at", nullable = false)
    private Instant computedAt;

    @PrePersist
    protected void onCreate() {
        if (this.id == null) {
            this.id = UUID.randomUUID();
        }
        if (this.computedAt == null) {
            this.computedAt = Instant.now();
        }
    }

    protected AssessmentMetric() {}

    public AssessmentMetric(AssessmentResult assessmentResult, UUID userId, AssessmentTemplate template) {
        this.assessmentResult = assessmentResult;
        this.userId = userId;
        this.template = template;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public AssessmentResult getAssessmentResult() { return assessmentResult; }
    public void setAssessmentResult(AssessmentResult assessmentResult) { this.assessmentResult = assessmentResult; }

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }

    public AssessmentTemplate getTemplate() { return template; }
    public void setTemplate(AssessmentTemplate template) { this.template = template; }

    public BigDecimal getTechnicalScore() { return technicalScore; }
    public void setTechnicalScore(BigDecimal technicalScore) { this.technicalScore = technicalScore; }

    public BigDecimal getAptitudeScore() { return aptitudeScore; }
    public void setAptitudeScore(BigDecimal aptitudeScore) { this.aptitudeScore = aptitudeScore; }

    public BigDecimal getBehavioralScore() { return behavioralScore; }
    public void setBehavioralScore(BigDecimal behavioralScore) { this.behavioralScore = behavioralScore; }

    public BigDecimal getCommunicationScore() { return communicationScore; }
    public void setCommunicationScore(BigDecimal communicationScore) { this.communicationScore = communicationScore; }

    public BigDecimal getDomainReadinessScore() { return domainReadinessScore; }
    public void setDomainReadinessScore(BigDecimal domainReadinessScore) { this.domainReadinessScore = domainReadinessScore; }

    public BigDecimal getOverallScore() { return overallScore; }
    public void setOverallScore(BigDecimal overallScore) { this.overallScore = overallScore; }

    public Instant getComputedAt() { return computedAt; }
    public void setComputedAt(Instant computedAt) { this.computedAt = computedAt; }
}
