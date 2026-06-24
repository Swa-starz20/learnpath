package com.learnpath.mentor;

import com.learnpath.assessment.entity.AssessmentMetric;
import com.learnpath.assessment.entity.AssessmentResult;
import com.learnpath.mentor.entity.MentorInsight;
import com.learnpath.mentor.service.MentorInsightGenerator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

/**
 * Unit tests for MentorInsightGenerator scoring rules.
 */
class MentorInsightGeneratorTest {

    private MentorInsightGenerator generator;
    private UUID userId;
    private AssessmentMetric metrics;
    private AssessmentResult result;

    @BeforeEach
    void setUp() {
        generator = new MentorInsightGenerator();
        userId = UUID.randomUUID();
        metrics = Mockito.mock(AssessmentMetric.class);
        result = Mockito.mock(AssessmentResult.class);
        when(metrics.getAssessmentResult()).thenReturn(result);
        when(result.getId()).thenReturn(UUID.randomUUID());
    }

    @Test
    @DisplayName("generateInsights — low technical score generates insight")
    void testLowTechnicalScore() {
        when(metrics.getTechnicalScore()).thenReturn(new BigDecimal("55.00"));

        List<MentorInsight> insights = generator.generateInsights(userId, metrics);

        assertEquals(1, insights.size());
        MentorInsight insight = insights.get(0);
        assertEquals("TECHNICAL", insight.getInsightType());
        assertEquals("Technical Skill Gap Detected", insight.getTitle());
    }

    @Test
    @DisplayName("generateInsights — high readiness score generates strong readiness insight")
    void testHighReadinessScore() {
        when(metrics.getDomainReadinessScore()).thenReturn(new BigDecimal("85.00"));

        List<MentorInsight> insights = generator.generateInsights(userId, metrics);

        assertEquals(1, insights.size());
        MentorInsight insight = insights.get(0);
        assertEquals("READINESS", insight.getInsightType());
        assertEquals("Strong Career Readiness", insight.getTitle());
    }

    @Test
    @DisplayName("generateInsights — low readiness score generates readiness alert")
    void testLowReadinessScore() {
        when(metrics.getDomainReadinessScore()).thenReturn(new BigDecimal("45.00"));

        List<MentorInsight> insights = generator.generateInsights(userId, metrics);

        assertEquals(1, insights.size());
        MentorInsight insight = insights.get(0);
        assertEquals("READINESS", insight.getInsightType());
        assertEquals("Domain Readiness Alert", insight.getTitle());
    }

    @Test
    @DisplayName("generateInsights — passing scores generate no warnings")
    void testPassingScores() {
        when(metrics.getTechnicalScore()).thenReturn(new BigDecimal("75.00"));
        when(metrics.getAptitudeScore()).thenReturn(new BigDecimal("70.00"));
        when(metrics.getBehavioralScore()).thenReturn(new BigDecimal("80.00"));
        when(metrics.getCommunicationScore()).thenReturn(new BigDecimal("90.00"));
        when(metrics.getDomainReadinessScore()).thenReturn(new BigDecimal("75.00"));

        List<MentorInsight> insights = generator.generateInsights(userId, metrics);
        assertTrue(insights.isEmpty());
    }
}
