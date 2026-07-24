package com.learnpath.assessment.event;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

/**
 * Spring Application Event published after an assessment session has been successfully evaluated and committed.
 */
public record AssessmentCompletedEvent(
        UUID sessionId,
        UUID userId,
        UUID resultId,
        BigDecimal overallScore,
        List<AnswerSummary> answers
) {
    public record AnswerSummary(
            Long skillId,
            boolean correct
    ) {}
}
