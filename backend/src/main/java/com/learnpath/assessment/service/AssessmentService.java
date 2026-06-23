package com.learnpath.assessment.service;

import com.learnpath.assessment.dto.*;
import com.learnpath.assessment.entity.*;
import com.learnpath.assessment.repository.*;
import com.learnpath.exception.AppException;
import com.learnpath.exception.DuplicateResourceException;
import com.learnpath.exception.ResourceNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Core service for all assessment operations.
 *
 * <p>Business rules enforced here:
 * <ul>
 *   <li>One active (IN_PROGRESS) session per user per template</li>
 *   <li>Cannot answer questions after session submission</li>
 *   <li>Cannot submit a session twice</li>
 *   <li>Result is created exactly once per session on submission</li>
 *   <li>score_percentage defaults to 0.00 — scoring engine is Phase 3B+</li>
 * </ul>
 *
 * <p>No progression updates, no skill updates, no events, no async processing.
 */
@Service
public class AssessmentService {

    private static final Logger log = LoggerFactory.getLogger(AssessmentService.class);

    private final AssessmentTemplateRepository templateRepository;
    private final AssessmentQuestionRepository questionRepository;
    private final AssessmentOptionRepository optionRepository;
    private final AssessmentSessionRepository sessionRepository;
    private final AssessmentAnswerRepository answerRepository;
    private final AssessmentResultRepository resultRepository;
    private final AssessmentEvaluationService evaluationService;

    public AssessmentService(
            AssessmentTemplateRepository templateRepository,
            AssessmentQuestionRepository questionRepository,
            AssessmentOptionRepository optionRepository,
            AssessmentSessionRepository sessionRepository,
            AssessmentAnswerRepository answerRepository,
            AssessmentResultRepository resultRepository,
            AssessmentEvaluationService evaluationService) {
        this.templateRepository = templateRepository;
        this.questionRepository = questionRepository;
        this.optionRepository = optionRepository;
        this.sessionRepository = sessionRepository;
        this.answerRepository = answerRepository;
        this.resultRepository = resultRepository;
        this.evaluationService = evaluationService;
    }

    // ── Template operations (public) ──────────────────────────────────────────

    /**
     * Returns all active assessment templates.
     */
    @Transactional(readOnly = true)
    public List<AssessmentTemplateResponse> listActiveTemplates() {
        return templateRepository.findByActiveTrueOrderByNameAsc()
                .stream()
                .map(AssessmentTemplateResponse::from)
                .collect(Collectors.toList());
    }

    /**
     * Returns a single template by ID, throwing 404 if not found.
     */
    @Transactional(readOnly = true)
    public AssessmentTemplateResponse getTemplateById(UUID id) {
        AssessmentTemplate template = templateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("AssessmentTemplate", "id", id));
        return AssessmentTemplateResponse.from(template);
    }

    // ── Session operations (authenticated) ────────────────────────────────────

    /**
     * Starts a new assessment session for the authenticated user.
     *
     * <p>Business rule: only one IN_PROGRESS session per user per template.
     * Throws 409 Conflict if one already exists.
     */
    @Transactional
    public AssessmentSessionResponse startSession(UUID userId, StartSessionRequest request) {
        AssessmentTemplate template = templateRepository.findById(request.templateId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "AssessmentTemplate", "id", request.templateId()));

        if (!template.isActive()) {
            throw new AppException(HttpStatus.BAD_REQUEST,
                    "Assessment template is not active.");
        }

        boolean activeSessionExists = sessionRepository.existsByUserIdAndTemplateIdAndStatus(
                userId, template.getId(), AssessmentSession.STATUS_IN_PROGRESS);

        if (activeSessionExists) {
            throw new DuplicateResourceException(
                    "An active session already exists for this assessment. Please complete or discard it first.");
        }

        AssessmentSession session = new AssessmentSession(userId, template);
        AssessmentSession saved = sessionRepository.save(session);
        log.info("Started assessment session {} for user {} on template {}",
                saved.getId(), userId, template.getCode());
        return AssessmentSessionResponse.from(saved);
    }

    /**
     * Returns a session by ID. Users can only see their own sessions.
     */
    @Transactional(readOnly = true)
    public AssessmentSessionResponse getSession(UUID sessionId, UUID userId) {
        AssessmentSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("AssessmentSession", "id", sessionId));
        assertOwnership(session.getUserId(), userId, "session");
        return AssessmentSessionResponse.from(session);
    }

    /**
     * Records or updates an answer for a question in an IN_PROGRESS session.
     *
     * <p>Business rules:
     * <ul>
     *   <li>Session must be IN_PROGRESS (not submitted)</li>
     *   <li>Question must belong to the session's template</li>
     *   <li>If selectedOptionId provided, option must belong to the question</li>
     *   <li>Answering the same question again updates the existing answer (upsert)</li>
     * </ul>
     */
    @Transactional
    public AssessmentAnswerResponse submitAnswer(UUID sessionId, UUID userId,
                                                 SubmitAnswerRequest request) {
        AssessmentSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("AssessmentSession", "id", sessionId));
        assertOwnership(session.getUserId(), userId, "session");

        if (!session.isInProgress()) {
            throw new AppException(HttpStatus.BAD_REQUEST,
                    "Cannot submit answers to a session that is not in progress.");
        }

        // Validate question belongs to this session's template
        AssessmentQuestion question = questionRepository.findById(request.questionId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "AssessmentQuestion", "id", request.questionId()));

        if (!question.getTemplate().getId().equals(session.getTemplate().getId())) {
            throw new AppException(HttpStatus.BAD_REQUEST,
                    "Question does not belong to this assessment template.");
        }

        // Validate selected option belongs to the question (if provided)
        AssessmentOption selectedOption = null;
        if (request.selectedOptionId() != null) {
            selectedOption = optionRepository.findById(request.selectedOptionId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "AssessmentOption", "id", request.selectedOptionId()));
            if (!selectedOption.getQuestion().getId().equals(question.getId())) {
                throw new AppException(HttpStatus.BAD_REQUEST,
                        "Selected option does not belong to this question.");
            }
        }

        // Upsert answer: update if exists, create if not
        AssessmentAnswer answer = answerRepository
                .findBySessionIdAndQuestionId(sessionId, question.getId())
                .orElseGet(() -> new AssessmentAnswer(session, question, null, null));

        answer.setSelectedOption(selectedOption);
        answer.setAnswerText(request.answerText());

        AssessmentAnswer saved = answerRepository.save(answer);
        log.debug("Recorded answer {} for question {} in session {}", saved.getId(),
                question.getId(), sessionId);
        return AssessmentAnswerResponse.from(saved);
    }

    /**
     * Submits (finalises) an IN_PROGRESS session and creates the result record.
     *
     * <p>Business rules:
     * <ul>
     *   <li>Session must be IN_PROGRESS</li>
     *   <li>Result is created exactly once</li>
     *   <li>score_percentage = 0 (scoring is Phase 3B+)</li>
     * </ul>
     */
    @Transactional
    public AssessmentResultResponse submitSession(UUID sessionId, UUID userId,
                                                  SubmitSessionRequest request) {
        AssessmentResult result = evaluationService.evaluateSession(sessionId, userId, request.timeSpentSeconds());
        return AssessmentResultResponse.from(result);
    }

    /**
     * Returns a result by ID. Users can only see their own results.
     */
    @Transactional(readOnly = true)
    public AssessmentResultResponse getResult(UUID resultId, UUID userId) {
        AssessmentResult result = resultRepository.findById(resultId)
                .orElseThrow(() -> new ResourceNotFoundException("AssessmentResult", "id", resultId));
        assertOwnership(result.getUserId(), userId, "result");
        return AssessmentResultResponse.from(result);
    }

    /**
     * Returns all results for the authenticated user ordered by completion time descending.
     */
    @Transactional(readOnly = true)
    public List<AssessmentResultResponse> getMyResults(UUID userId) {
        return resultRepository.findByUserIdOrderByCompletedAtDesc(userId)
                .stream()
                .map(AssessmentResultResponse::from)
                .collect(Collectors.toList());
    }

    // ── Private helpers ───────────────────────────────────────────────────────

    /**
     * Asserts that the resource belongs to the requesting user.
     * Throws 403 Forbidden if ownership check fails.
     */
    private void assertOwnership(UUID resourceOwner, UUID requestingUser, String resourceType) {
        if (!resourceOwner.equals(requestingUser)) {
            throw new AppException(HttpStatus.FORBIDDEN,
                    "You do not have access to this " + resourceType + ".");
        }
    }
}
