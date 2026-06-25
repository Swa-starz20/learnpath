package com.learnpath.placement;

import com.learnpath.assessment.entity.AssessmentMetric;
import com.learnpath.placement.entity.PlacementInsight;
import com.learnpath.placement.entity.PlacementProfile;
import com.learnpath.placement.service.PlacementInsightGenerator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class PlacementInsightGeneratorTest {

    private PlacementInsightGenerator generator;
    private UUID userId;
    private PlacementProfile profile;
    private UUID assessmentResultId;

    @BeforeEach
    void setUp() {
        generator = new PlacementInsightGenerator();
        userId = UUID.randomUUID();
        profile = mock(PlacementProfile.class);
        when(profile.getId()).thenReturn(UUID.randomUUID());
        assessmentResultId = UUID.randomUUID();
    }

    @Test
    void generateInsights_allStrengths() {
        AssessmentMetric metric = mock(AssessmentMetric.class);
        when(metric.getTechnicalScore()).thenReturn(new BigDecimal("85.00"));
        when(metric.getAptitudeScore()).thenReturn(new BigDecimal("90.00"));
        when(metric.getCommunicationScore()).thenReturn(new BigDecimal("82.00"));
        when(metric.getBehavioralScore()).thenReturn(new BigDecimal("88.00"));
        when(metric.getOverallScore()).thenReturn(new BigDecimal("86.25"));

        List<PlacementInsight> insights = generator.generateInsights(userId, profile, assessmentResultId, metric);

        assertEquals(4, insights.size());
        assertTrue(insights.stream().allMatch(i -> "STRENGTH".equalsIgnoreCase(i.getInsightType())));
    }

    @Test
    void generateInsights_allWeaknessesAndWarning() {
        AssessmentMetric metric = mock(AssessmentMetric.class);
        when(metric.getTechnicalScore()).thenReturn(new BigDecimal("45.00"));
        when(metric.getAptitudeScore()).thenReturn(new BigDecimal("40.00"));
        when(metric.getCommunicationScore()).thenReturn(new BigDecimal("35.00"));
        when(metric.getBehavioralScore()).thenReturn(new BigDecimal("48.00"));
        when(metric.getOverallScore()).thenReturn(new BigDecimal("42.00"));

        List<PlacementInsight> insights = generator.generateInsights(userId, profile, assessmentResultId, metric);

        assertEquals(5, insights.size());
        long weaknessCount = insights.stream().filter(i -> "WEAKNESS".equalsIgnoreCase(i.getInsightType())).count();
        long warningCount = insights.stream().filter(i -> "WARNING".equalsIgnoreCase(i.getInsightType())).count();
        assertEquals(4, weaknessCount);
        assertEquals(1, warningCount);
    }
}
