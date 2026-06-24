package com.learnpath.mentor.service;

import com.learnpath.assessment.entity.AssessmentMetric;
import com.learnpath.mentor.entity.MentorRecommendation;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Generator that creates deterministic mentor recommendations based on assessment metrics.
 */
@Component
public class MentorRecommendationGenerator {

    private static final BigDecimal THRESHOLD_60 = new BigDecimal("60.00");

    /**
     * Evaluates assessment metrics and generates relevant recommendations.
     */
    public List<MentorRecommendation> generateRecommendations(UUID userId, AssessmentMetric metrics) {
        List<MentorRecommendation> recommendations = new ArrayList<>();
        if (metrics == null) {
            return recommendations;
        }

        // Low Technical -> Roadmap Fundamentals
        if (metrics.getTechnicalScore() != null && metrics.getTechnicalScore().compareTo(THRESHOLD_60) < 0) {
            recommendations.add(new MentorRecommendation(
                    userId,
                    "ROADMAP_FUNDAMENTALS",
                    "Strengthen Technical Fundamentals",
                    "Complete foundational programming topics on your domain roadmap to improve code quality.",
                    "/roadmap"
            ));
        }

        // Low Communication -> Communication Practice
        if (metrics.getCommunicationScore() != null && metrics.getCommunicationScore().compareTo(THRESHOLD_60) < 0) {
            recommendations.add(new MentorRecommendation(
                    userId,
                    "COMMUNICATION_PRACTICE",
                    "Practice Verbal & Business English",
                    "Engage in active communication and verbal reasoning practice exercises.",
                    "/courses"
            ));
        }

        // Low Aptitude -> Aptitude Exercises
        if (metrics.getAptitudeScore() != null && metrics.getAptitudeScore().compareTo(THRESHOLD_60) < 0) {
            recommendations.add(new MentorRecommendation(
                    userId,
                    "APTITUDE_EXERCISES",
                    "Solve Aptitude & Logical Exercises",
                    "Improve your cognitive problem solving by completing quantitative and logical practice tests.",
                    "/assessments"
            ));
        }

        // Low Readiness -> Skill Strengthening
        if (metrics.getDomainReadinessScore() != null && metrics.getDomainReadinessScore().compareTo(THRESHOLD_60) < 0) {
            recommendations.add(new MentorRecommendation(
                    userId,
                    "SKILL_STRENGTHENING",
                    "Focus on Skill Strengthening",
                    "Work on weak areas highlighted in your skill report to elevate your overall placement readiness.",
                    "/skills"
            ));
        }

        return recommendations;
    }
}
