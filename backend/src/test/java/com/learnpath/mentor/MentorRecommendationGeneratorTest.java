package com.learnpath.mentor;

import com.learnpath.assessment.entity.AssessmentMetric;
import com.learnpath.mentor.entity.MentorRecommendation;
import com.learnpath.mentor.service.MentorRecommendationGenerator;
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
 * Unit tests for MentorRecommendationGenerator scoring rules.
 */
class MentorRecommendationGeneratorTest {

    private MentorRecommendationGenerator generator;
    private UUID userId;
    private AssessmentMetric metrics;

    @BeforeEach
    void setUp() {
        generator = new MentorRecommendationGenerator();
        userId = UUID.randomUUID();
        metrics = Mockito.mock(AssessmentMetric.class);
    }

    @Test
    @DisplayName("generateRecommendations — low technical score generates roadmap recommendation")
    void testLowTechnicalRecommendation() {
        when(metrics.getTechnicalScore()).thenReturn(new BigDecimal("50.00"));

        List<MentorRecommendation> recommendations = generator.generateRecommendations(userId, metrics);

        assertEquals(1, recommendations.size());
        MentorRecommendation rec = recommendations.get(0);
        assertEquals("ROADMAP_FUNDAMENTALS", rec.getRecommendationType());
        assertEquals("Strengthen Technical Fundamentals", rec.getTitle());
    }

    @Test
    @DisplayName("generateRecommendations — low communication score generates communication practice recommendation")
    void testLowCommunicationRecommendation() {
        when(metrics.getCommunicationScore()).thenReturn(new BigDecimal("40.00"));

        List<MentorRecommendation> recommendations = generator.generateRecommendations(userId, metrics);

        assertEquals(1, recommendations.size());
        MentorRecommendation rec = recommendations.get(0);
        assertEquals("COMMUNICATION_PRACTICE", rec.getRecommendationType());
        assertEquals("Practice Verbal & Business English", rec.getTitle());
    }

    @Test
    @DisplayName("generateRecommendations — low aptitude score generates aptitude exercise recommendation")
    void testLowAptitudeRecommendation() {
        when(metrics.getAptitudeScore()).thenReturn(new BigDecimal("30.00"));

        List<MentorRecommendation> recommendations = generator.generateRecommendations(userId, metrics);

        assertEquals(1, recommendations.size());
        MentorRecommendation rec = recommendations.get(0);
        assertEquals("APTITUDE_EXERCISES", rec.getRecommendationType());
        assertEquals("Solve Aptitude & Logical Exercises", rec.getTitle());
    }

    @Test
    @DisplayName("generateRecommendations — low readiness score generates skill strengthening recommendation")
    void testLowReadinessRecommendation() {
        when(metrics.getDomainReadinessScore()).thenReturn(new BigDecimal("55.00"));

        List<MentorRecommendation> recommendations = generator.generateRecommendations(userId, metrics);

        assertEquals(1, recommendations.size());
        MentorRecommendation rec = recommendations.get(0);
        assertEquals("SKILL_STRENGTHENING", rec.getRecommendationType());
        assertEquals("Focus on Skill Strengthening", rec.getTitle());
    }
}
