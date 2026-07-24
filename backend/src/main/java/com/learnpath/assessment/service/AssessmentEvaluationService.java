package com.learnpath.assessment.service;

import com.learnpath.assessment.entity.*;
import com.learnpath.assessment.event.AssessmentCompletedEvent;
import com.learnpath.assessment.event.AssessmentCompletedEvent.AnswerSummary;
import com.learnpath.assessment.repository.*;
import com.learnpath.exception.AppException;
import com.learnpath.exception.DuplicateResourceException;
import com.learnpath.exception.ResourceNotFoundException;
import com.learnpath.skill.entity.Skill;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;

/**
 * Core evaluation engine that processes completed assessment sessions,
 * computes deterministic category-wise scores and overall scores,
 * persists results and metrics, and publishes assessment events.
 */
@Service
public class AssessmentEvaluationService {

    private static final Logger log = LoggerFactory.getLogger(AssessmentEvaluationService.class);

    private final AssessmentSessionRepository sessionRepository;
    private final AssessmentAnswerRepository answerRepository;
    private final AssessmentResultRepository resultRepository;
    private final AssessmentMetricRepository metricRepository;
    private final ApplicationEventPublisher eventPublisher;

    public AssessmentEvaluationService(
            AssessmentSessionRepository sessionRepository,
            AssessmentAnswerRepository answerRepository,
            AssessmentResultRepository resultRepository,
            AssessmentMetricRepository metricRepository,
            ApplicationEventPublisher eventPublisher) {
        this.sessionRepository = sessionRepository;
        this.answerRepository = answerRepository;
        this.resultRepository = resultRepository;
        this.metricRepository = metricRepository;
        this.eventPublisher = eventPublisher;
    }

    /**
     * Evaluates a completed assessment session.
     *
     * <p>Enforces idempotency and transaction boundaries.
     * Calculates deterministic scores, creates result & metrics, and publishes event.
     */
    @Transactional
    public AssessmentResult evaluateSession(UUID sessionId, UUID userId, int timeSpentSeconds) {
        // Retrieve and lock/validate session
        AssessmentSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("AssessmentSession", "id", sessionId));

        // Enforce ownership
        if (!session.getUserId().equals(userId)) {
            throw new AppException(HttpStatus.FORBIDDEN, "You do not have access to this session.");
        }

        // 1. Service Layer Idempotency check: Session status check
        if (!session.isInProgress()) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Session is not in progress and cannot be evaluated.");
        }

        // 2. Service Layer Idempotency check: Database check for duplicates
        if (resultRepository.existsBySessionId(sessionId)) {
            throw new DuplicateResourceException("A result record already exists for this session.");
        }

        log.info("Evaluating assessment session {} for user {}", sessionId, userId);

        // Fetch all answers for the session
        List<AssessmentAnswer> answers = answerRepository.findBySessionId(sessionId);

        // Track counters for scoring
        int overallTotal = answers.size();
        int overallCorrect = 0;

        int techTotal = 0, techCorrect = 0;
        int aptTotal = 0, aptCorrect = 0;
        int behavTotal = 0, behavCorrect = 0;
        int commTotal = 0, commCorrect = 0;
        int domainTotal = 0, domainCorrect = 0;

        List<AnswerSummary> answerSummaries = new ArrayList<>();

        for (AssessmentAnswer answer : answers) {
            AssessmentQuestion question = answer.getQuestion();
            AssessmentOption selectedOption = answer.getSelectedOption();

            boolean isCorrect = selectedOption != null && selectedOption.isCorrect();
            if (isCorrect) {
                overallCorrect++;
            }

            // Map question to skill category
            Skill skill = question.getSkill();
            Long skillId = skill != null ? skill.getId() : null;
            answerSummaries.add(new AnswerSummary(skillId, isCorrect));

            String category = determineScoreCategory(skill);
            log.info("Processing answer: skillCategory={}, mappedCategory={}, isCorrect={}",
                    skill != null ? skill.getCategory() : "null", category, isCorrect);
            switch (category) {
                case "APTITUDE":
                    aptTotal++;
                    if (isCorrect) aptCorrect++;
                    break;
                case "BEHAVIORAL":
                    behavTotal++;
                    if (isCorrect) behavCorrect++;
                    break;
                case "COMMUNICATION":
                    commTotal++;
                    if (isCorrect) commCorrect++;
                    break;
                case "TECHNICAL":
                default:
                    techTotal++;
                    domainTotal++;
                    if (isCorrect) {
                        techCorrect++;
                        domainCorrect++;
                    }
                    break;
            }
        }

        // Compute overall score
        BigDecimal overallScore = calculatePercentage(overallCorrect, overallTotal);

        // Transition session status
        session.submit(timeSpentSeconds);
        sessionRepository.save(session);

        // Create and save AssessmentResult
        AssessmentResult result = new AssessmentResult(session, userId, session.getTemplate());
        result.setScorePercentage(overallScore);
        AssessmentResult savedResult = resultRepository.save(result);

        // Enforce metrics idempotency before saving
        if (metricRepository.existsByAssessmentResultId(savedResult.getId())) {
            throw new DuplicateResourceException("Metrics record already exists for this result.");
        }

        // Create and save AssessmentMetric breakdown
        AssessmentMetric metric = new AssessmentMetric(savedResult, userId, session.getTemplate());
        metric.setOverallScore(overallScore);
        metric.setTechnicalScore(calculatePercentage(techCorrect, techTotal));
        metric.setAptitudeScore(calculatePercentage(aptCorrect, aptTotal));
        metric.setBehavioralScore(calculatePercentage(behavCorrect, behavTotal));
        metric.setCommunicationScore(calculatePercentage(commCorrect, commTotal));
        metric.setDomainReadinessScore(calculatePercentage(domainCorrect, domainTotal));
        metricRepository.save(metric);

        log.info("Evaluation complete for session {}. Overall Score: {}%", sessionId, overallScore);

        // Publish AssessmentCompletedEvent
        AssessmentCompletedEvent event = new AssessmentCompletedEvent(
                sessionId,
                userId,
                savedResult.getId(),
                overallScore,
                answerSummaries
        );
        eventPublisher.publishEvent(event);

        return savedResult;
    }

    private String determineScoreCategory(Skill skill) {
        if (skill == null || skill.getCategory() == null) {
            return "TECHNICAL";
        }
        String cat = skill.getCategory().toUpperCase();
        if (cat.contains("SOFTWARE")) {
            return "TECHNICAL";
        }
        if (cat.contains("APTITUDE") || cat.contains("MATH") || cat.contains("LOGIC") || cat.contains("COGNITIVE") || cat.contains("REASONING")) {
            return "APTITUDE";
        }
        if (cat.contains("BEHAVIOR") || cat.contains("SOFT") || cat.contains("LEADERSHIP") || cat.contains("MANAGEMENT") || cat.contains("COLLABORATION")) {
            return "BEHAVIORAL";
        }
        if (cat.contains("COMMUNICATION") || cat.contains("VERBAL") || cat.contains("WRITING") || cat.contains("ENGLISH")) {
            return "COMMUNICATION";
        }
        if (cat.contains("READINESS") || cat.contains("DOMAIN") || cat.contains("OVERALL")) {
            return "DOMAIN_READINESS";
        }
        return "TECHNICAL";
    }

    private BigDecimal calculatePercentage(int correct, int total) {
        if (total == 0) {
            return null;
        }
        return BigDecimal.valueOf(correct)
                .multiply(BigDecimal.valueOf(100))
                .divide(BigDecimal.valueOf(total), 2, RoundingMode.HALF_UP);
    }
}
