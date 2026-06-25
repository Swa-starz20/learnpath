package com.learnpath.placement.service;

import com.learnpath.placement.entity.PlacementInsight;
import com.learnpath.placement.entity.PlacementRecommendation;
import com.learnpath.placement.entity.PlacementProfile;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Component
public class PlacementRecommendationGenerator {

    public List<PlacementRecommendation> generateRecommendations(UUID userId, PlacementProfile profile, UUID assessmentResultId, List<PlacementInsight> insights) {
        List<PlacementRecommendation> recommendations = new ArrayList<>();

        if (insights == null) return recommendations;

        for (PlacementInsight insight : insights) {
            PlacementRecommendation rec = null;
            if ("WEAKNESS".equalsIgnoreCase(insight.getInsightType()) && "APTITUDE".equalsIgnoreCase(insight.getCategory())) {
                rec = new PlacementRecommendation(userId, profile, assessmentResultId, "ASSESSMENT_RETAKE",
                        "Retake Aptitude Assessment",
                        "We recommend retaking the aptitude assessment to improve your score.",
                        "/api/v1/assessments");
            } else if ("WEAKNESS".equalsIgnoreCase(insight.getInsightType()) && "COMMUNICATION".equalsIgnoreCase(insight.getCategory())) {
                rec = new PlacementRecommendation(userId, profile, assessmentResultId, "INTERVIEW_PREP",
                        "Practice Mock Interviews",
                        "Focus on communication skills by conducting mock interviews or reviewing resources.",
                        "/api/v1/mock-interviews");
            } else if ("WEAKNESS".equalsIgnoreCase(insight.getInsightType()) && "TECHNICAL".equalsIgnoreCase(insight.getCategory())) {
                rec = new PlacementRecommendation(userId, profile, assessmentResultId, "COURSE_SUGGESTION",
                        "Enroll in Technical Skill Courses",
                        "Review courses matching your domain to bridge the technical knowledge gaps.",
                        "/api/v1/courses");
            } else if ("WARNING".equalsIgnoreCase(insight.getInsightType()) && "OVERALL".equalsIgnoreCase(insight.getCategory())) {
                rec = new PlacementRecommendation(userId, profile, assessmentResultId, "ROADMAP_ACTION",
                        "Follow Personalized Learning Roadmap",
                        "Stick to your domain roadmap to improve your overall readiness score.",
                        "/api/v1/roadmaps");
            }

            if (rec != null) {
                rec.setInsight(insight);
                recommendations.add(rec);
            }
        }

        return recommendations;
    }
}
