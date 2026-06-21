package com.learnpath.assessment.entity;

import com.learnpath.skill.entity.Skill;
import jakarta.persistence.*;

import java.time.Instant;
import java.util.UUID;

/**
 * A single question within an assessment template.
 *
 * <p>Table: {@code assessment_questions}
 * Questions belong to exactly one {@link AssessmentTemplate}.
 * Optionally linked to a {@link Skill} for future scoring context.
 */
@Entity
@Table(
    name = "assessment_questions",
    indexes = {
        @Index(name = "idx_assessment_questions_template", columnList = "template_id"),
        @Index(name = "idx_assessment_questions_skill",    columnList = "skill_id"),
        @Index(name = "idx_assessment_questions_order",    columnList = "template_id, display_order")
    }
)
public class AssessmentQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", columnDefinition = "UUID", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "template_id", nullable = false)
    private AssessmentTemplate template;

    @Column(name = "question_text", nullable = false, columnDefinition = "TEXT")
    private String questionText;

    @Column(name = "question_type", nullable = false, length = 50)
    private String questionType = "MULTIPLE_CHOICE";

    @Column(name = "difficulty_level", nullable = false, length = 20)
    private String difficultyLevel = "MEDIUM";

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "skill_id")
    private Skill skill;

    @Column(name = "display_order", nullable = false)
    private Integer displayOrder = 0;

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

    protected AssessmentQuestion() {}

    public AssessmentQuestion(AssessmentTemplate template, String questionText,
                              String questionType, String difficultyLevel,
                              Skill skill, Integer displayOrder) {
        this.template = template;
        this.questionText = questionText;
        this.questionType = questionType;
        this.difficultyLevel = difficultyLevel;
        this.skill = skill;
        this.displayOrder = displayOrder != null ? displayOrder : 0;
    }

    // ── Getters ───────────────────────────────────────────────────────────────

    public UUID getId() { return id; }
    public AssessmentTemplate getTemplate() { return template; }
    public String getQuestionText() { return questionText; }
    public String getQuestionType() { return questionType; }
    public String getDifficultyLevel() { return difficultyLevel; }
    public Skill getSkill() { return skill; }
    public Integer getDisplayOrder() { return displayOrder; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }

    // ── Setters ───────────────────────────────────────────────────────────────

    public void setQuestionText(String questionText) { this.questionText = questionText; }
    public void setQuestionType(String questionType) { this.questionType = questionType; }
    public void setDifficultyLevel(String difficultyLevel) { this.difficultyLevel = difficultyLevel; }
    public void setSkill(Skill skill) { this.skill = skill; }
    public void setDisplayOrder(Integer displayOrder) { this.displayOrder = displayOrder; }
}
