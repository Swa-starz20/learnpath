package com.learnpath.assessment.dto;

import com.learnpath.assessment.entity.AssessmentOption;
import com.learnpath.assessment.entity.AssessmentQuestion;

import java.util.List;
import java.util.UUID;

/**
 * Read-only view of an {@link AssessmentQuestion} including its options.
 * The {@code isCorrect} field of options is intentionally NOT exposed here.
 */
public record AssessmentQuestionResponse(
        UUID id,
        UUID templateId,
        String questionText,
        String questionType,
        String difficultyLevel,
        Long skillId,
        Integer displayOrder,
        List<OptionResponse> options
) {
    /**
     * Lightweight option view that omits the {@code isCorrect} flag
     * to prevent answer leakage to clients.
     */
    public record OptionResponse(
            UUID id,
            String optionText,
            String optionValue,
            Integer displayOrder
    ) {
        public static OptionResponse from(AssessmentOption o) {
            return new OptionResponse(
                    o.getId(),
                    o.getOptionText(),
                    o.getOptionValue(),
                    o.getDisplayOrder()
            );
        }
    }

    public static AssessmentQuestionResponse from(AssessmentQuestion q, List<AssessmentOption> options) {
        return new AssessmentQuestionResponse(
                q.getId(),
                q.getTemplate().getId(),
                q.getQuestionText(),
                q.getQuestionType(),
                q.getDifficultyLevel(),
                q.getSkill() != null ? q.getSkill().getId() : null,
                q.getDisplayOrder(),
                options.stream().map(OptionResponse::from).toList()
        );
    }
}
