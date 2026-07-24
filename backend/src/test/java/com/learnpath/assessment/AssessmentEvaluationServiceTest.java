package com.learnpath.assessment;

import com.learnpath.assessment.entity.*;
import com.learnpath.assessment.repository.*;
import com.learnpath.assessment.service.AssessmentEvaluationService;
import com.learnpath.assessment.event.AssessmentCompletedEvent;
import com.learnpath.domain.entity.Domain;
import com.learnpath.exception.DuplicateResourceException;
import com.learnpath.skill.entity.Skill;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.ApplicationEventPublisher;

import java.math.BigDecimal;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AssessmentEvaluationServiceTest {

    @Mock
    private AssessmentSessionRepository sessionRepository;
    @Mock
    private AssessmentAnswerRepository answerRepository;
    @Mock
    private AssessmentResultRepository resultRepository;
    @Mock
    private AssessmentMetricRepository metricRepository;
    @Mock
    private ApplicationEventPublisher eventPublisher;

    private AssessmentEvaluationService evaluationService;

    private UUID sessionId;
    private UUID userId;
    private AssessmentSession session;
    private AssessmentTemplate template;
    private Domain domain;

    @BeforeEach
    void setUp() {
        evaluationService = new AssessmentEvaluationService(
                sessionRepository,
                answerRepository,
                resultRepository,
                metricRepository,
                eventPublisher
        );

        sessionId = UUID.randomUUID();
        userId = UUID.randomUUID();
        domain = new Domain("COMP_ENG", "Computer Engineering", "Desc", "cpu");
        template = new AssessmentTemplate("COMP_ENG_ALGO_1", "Algorithms Diagnostic", "Desc", "QUIZ", domain, 30, 2);
        session = new AssessmentSession(userId, template);
        // reflection or setter to set ID since it's database generated
        // We can mock repositories to return session/results correctly
    }

    @Test
    @DisplayName("evaluateSession — successfully calculates overall and category scores")
    void evaluateSession_success() {
        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session));
        when(resultRepository.existsBySessionId(sessionId)).thenReturn(false);

        // Seed some answers: 1 correct Technical/Domain question, 1 incorrect Aptitude question
        Skill techSkill = new Skill(domain, "Algorithms", "Desc", "SOFTWARE_DEVELOPMENT");
        Skill aptSkill = new Skill(domain, "Logic", "Desc", "COGNITIVE_APTITUDE");

        AssessmentQuestion techQuestion = new AssessmentQuestion(template, "Q1", "MULT_CHOICE", "MEDIUM", techSkill, 1);
        AssessmentQuestion aptQuestion = new AssessmentQuestion(template, "Q2", "MULT_CHOICE", "MEDIUM", aptSkill, 2);

        AssessmentOption techOptionCorrect = new AssessmentOption(techQuestion, "Correct", "val", 1, true);
        AssessmentOption aptOptionIncorrect = new AssessmentOption(aptQuestion, "Incorrect", "val", 1, false);

        AssessmentAnswer techAnswer = new AssessmentAnswer(session, techQuestion, techOptionCorrect, null);
        AssessmentAnswer aptAnswer = new AssessmentAnswer(session, aptQuestion, aptOptionIncorrect, null);

        when(answerRepository.findBySessionId(sessionId)).thenReturn(Arrays.asList(techAnswer, aptAnswer));

        // Mock saves to return their arguments
        when(sessionRepository.save(any(AssessmentSession.class))).thenAnswer(i -> i.getArgument(0));
        when(resultRepository.save(any(AssessmentResult.class))).thenAnswer(i -> i.getArgument(0));
        when(metricRepository.save(any(AssessmentMetric.class))).thenAnswer(i -> i.getArgument(0));

        // Execute
        AssessmentResult result = evaluationService.evaluateSession(sessionId, userId, 120);

        // Verify status changes to SUBMITTED
        assertEquals("SUBMITTED", session.getStatus());
        assertEquals(120, session.getTimeSpentSeconds());

        // Verify result overall score (1 out of 2 correct = 50.00%)
        assertEquals(new BigDecimal("50.00"), result.getScorePercentage());

        // Capture saved metrics to verify category scoring
        ArgumentCaptor<AssessmentMetric> metricCaptor = ArgumentCaptor.forClass(AssessmentMetric.class);
        verify(metricRepository).save(metricCaptor.capture());
        AssessmentMetric savedMetric = metricCaptor.getValue();

        // Technical: 1/1 correct = 100.00%
        assertEquals(new BigDecimal("100.00"), savedMetric.getTechnicalScore());
        // Aptitude: 0/1 correct = 0.00%
        assertEquals(new BigDecimal("0.00"), savedMetric.getAptitudeScore());
        // Behavioral: 0 questions = null
        assertNull(savedMetric.getBehavioralScore());
        // Communication: 0 questions = null
        assertNull(savedMetric.getCommunicationScore());
        // Domain Readiness: 1/1 correct = 100.00%
        assertEquals(new BigDecimal("100.00"), savedMetric.getDomainReadinessScore());

        verify(eventPublisher).publishEvent(any(AssessmentCompletedEvent.class));
    }

    @Test
    @DisplayName("evaluateSession — throws DuplicateResourceException if result already exists")
    void evaluateSession_duplicateFails() {
        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session));
        when(resultRepository.existsBySessionId(sessionId)).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () ->
                evaluationService.evaluateSession(sessionId, userId, 100)
        );

        verify(answerRepository, never()).findBySessionId(any());
        verify(eventPublisher, never()).publishEvent(any());
    }
}
