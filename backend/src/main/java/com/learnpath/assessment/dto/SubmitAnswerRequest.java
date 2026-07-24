package com.learnpath.assessment.dto;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

/**
 * Request DTO for submitting an answer to a question within a session.
 * Either selectedOptionId (MCQ) or answerText (free-text) should be provided,
 * but not both. At least one must be non-null for a meaningful answer.
 */
public record SubmitAnswerRequest(
        @NotNull(message = "Question ID is required")
        UUID questionId,

        UUID selectedOptionId,

        String answerText
) {}
