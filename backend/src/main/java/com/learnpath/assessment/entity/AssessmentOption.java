package com.learnpath.assessment.entity;

import jakarta.persistence.*;

import java.util.UUID;

/**
 * An answer option for a multiple-choice {@link AssessmentQuestion}.
 *
 * <p>Table: {@code assessment_options}
 * {@code is_correct} is stored here to support scoring in future phases.
 * Not exposed in the public API to prevent answer leakage.
 */
@Entity
@Table(
    name = "assessment_options",
    indexes = {
        @Index(name = "idx_assessment_options_question", columnList = "question_id"),
        @Index(name = "idx_assessment_options_order",    columnList = "question_id, display_order")
    }
)
public class AssessmentOption {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", columnDefinition = "UUID", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "question_id", nullable = false)
    private AssessmentQuestion question;

    @Column(name = "option_text", nullable = false, columnDefinition = "TEXT")
    private String optionText;

    @Column(name = "option_value", nullable = false, length = 100)
    private String optionValue;

    @Column(name = "display_order", nullable = false)
    private Integer displayOrder = 0;

    @Column(name = "is_correct", nullable = false)
    private boolean correct = false;

    // ── Constructors ──────────────────────────────────────────────────────────

    protected AssessmentOption() {}

    public AssessmentOption(AssessmentQuestion question, String optionText,
                            String optionValue, Integer displayOrder, boolean correct) {
        this.question = question;
        this.optionText = optionText;
        this.optionValue = optionValue;
        this.displayOrder = displayOrder != null ? displayOrder : 0;
        this.correct = correct;
    }

    // ── Getters ───────────────────────────────────────────────────────────────

    public UUID getId() { return id; }
    public AssessmentQuestion getQuestion() { return question; }
    public String getOptionText() { return optionText; }
    public String getOptionValue() { return optionValue; }
    public Integer getDisplayOrder() { return displayOrder; }
    public boolean isCorrect() { return correct; }

    // ── Setters ───────────────────────────────────────────────────────────────

    public void setOptionText(String optionText) { this.optionText = optionText; }
    public void setOptionValue(String optionValue) { this.optionValue = optionValue; }
    public void setDisplayOrder(Integer displayOrder) { this.displayOrder = displayOrder; }
    public void setCorrect(boolean correct) { this.correct = correct; }
}
