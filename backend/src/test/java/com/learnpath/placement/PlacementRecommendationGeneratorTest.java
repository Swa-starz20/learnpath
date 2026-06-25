package com.learnpath.placement;

import com.learnpath.placement.entity.PlacementInsight;
import com.learnpath.placement.entity.PlacementRecommendation;
import com.learnpath.placement.entity.PlacementProfile;
import com.learnpath.placement.service.PlacementRecommendationGenerator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class PlacementRecommendationGeneratorTest {

    private PlacementRecommendationGenerator generator;
    private UUID userId;
    private PlacementProfile profile;
    private UUID assessmentResultId;

    @BeforeEach
    void setUp() {
        generator = new PlacementRecommendationGenerator();
        userId = UUID.randomUUID();
        profile = mock(PlacementProfile.class);
        when(profile.getId()).thenReturn(UUID.randomUUID());
        assessmentResultId = UUID.randomUUID();
    }

    @Test
    void generateRecommendations_success() {
        List<PlacementInsight> insights = new ArrayList<>();
        insights.add(new PlacementInsight(userId, profile, assessmentResultId, "WEAKNESS", "APTITUDE", "Low Aptitude", "Aptitude weak"));
        insights.add(new PlacementInsight(userId, profile, assessmentResultId, "WEAKNESS", "COMMUNICATION", "Comm weak", "Comm weak description"));
        insights.add(new PlacementInsight(userId, profile, assessmentResultId, "WARNING", "OVERALL", "Overall Risk", "Overall Risk description"));

        List<PlacementRecommendation> recs = generator.generateRecommendations(userId, profile, assessmentResultId, insights);

        assertEquals(3, recs.size());
        assertTrue(recs.stream().anyMatch(r -> "ASSESSMENT_RETAKE".equals(r.getRecommendationType())));
        assertTrue(recs.stream().anyMatch(r -> "INTERVIEW_PREP".equals(r.getRecommendationType())));
        assertTrue(recs.stream().anyMatch(r -> "ROADMAP_ACTION".equals(r.getRecommendationType())));
    }
}
