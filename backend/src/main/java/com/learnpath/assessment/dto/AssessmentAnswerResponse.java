package com.learnpath.assessment.dto;

import com.learnpath.assessment.entity.AssessmentAnswer;

import java.time.Instant;
import java.util.UUID;

/**
 * Read-only view of an {@link AssessmentAnswer}.
 */
public record AssessmentAnswerResponse(
        UUID id,
        UUID sessionId,
        UUID questionId,
        UUID selectedOptionId,
        String answerText,
        Instant answeredAt
) {
    public static AssessmentAnswerResponse from(AssessmentAnswer a) {
        return new AssessmentAnswerResponse(
                a.getId(),
                a.getSession().getId(),
                a.getQuestion().getId(),
                a.getSelectedOption() != null ? a.getSelectedOption().getId() : null,
                a.getAnswerText(),
                a.getAnsweredAt()
        );
    }
}
