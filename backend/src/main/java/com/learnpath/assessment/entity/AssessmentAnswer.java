package com.learnpath.assessment.entity;

import jakarta.persistence.*;

import java.time.Instant;
import java.util.UUID;

/**
 * A user's answer to one question within a session.
 *
 * <p>Table: {@code assessment_answers}
 * UNIQUE constraint on (session_id, question_id) prevents double-answering.
 * A question can be answered via option selection (MCQ) or free text.
 */
@Entity
@Table(
    name = "assessment_answers",
    indexes = {
        @Index(name = "idx_assessment_answers_session",  columnList = "session_id"),
        @Index(name = "idx_assessment_answers_question", columnList = "question_id")
    },
    uniqueConstraints = {
        @UniqueConstraint(name = "uq_answer_per_question",
                          columnNames = {"session_id", "question_id"})
    }
)
public class AssessmentAnswer {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", columnDefinition = "UUID", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "session_id", nullable = false)
    private AssessmentSession session;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "question_id", nullable = false)
    private AssessmentQuestion question;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "selected_option_id")
    private AssessmentOption selectedOption;

    @Column(name = "answer_text", columnDefinition = "TEXT")
    private String answerText;

    @Column(name = "answered_at", nullable = false, updatable = false)
    private Instant answeredAt;

    // ── Lifecycle ─────────────────────────────────────────────────────────────

    @PrePersist
    protected void onCreate() {
        this.answeredAt = Instant.now();
    }

    // ── Constructors ──────────────────────────────────────────────────────────

    protected AssessmentAnswer() {}

    public AssessmentAnswer(AssessmentSession session, AssessmentQuestion question,
                            AssessmentOption selectedOption, String answerText) {
        this.session = session;
        this.question = question;
        this.selectedOption = selectedOption;
        this.answerText = answerText;
    }

    // ── Getters ───────────────────────────────────────────────────────────────

    public UUID getId() { return id; }
    public AssessmentSession getSession() { return session; }
    public AssessmentQuestion getQuestion() { return question; }
    public AssessmentOption getSelectedOption() { return selectedOption; }
    public String getAnswerText() { return answerText; }
    public Instant getAnsweredAt() { return answeredAt; }

    // ── Setters (for upsert / answer-update scenarios) ────────────────────────

    public void setSelectedOption(AssessmentOption selectedOption) { this.selectedOption = selectedOption; }
    public void setAnswerText(String answerText) { this.answerText = answerText; }
}
