package com.learnpath.mentor.service;

import com.learnpath.assessment.entity.AssessmentMetric;
import com.learnpath.mentor.entity.MentorInsight;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Generator that creates deterministic mentor insights based on assessment metrics.
 */
@Component
public class MentorInsightGenerator {

    private static final BigDecimal THRESHOLD_60 = new BigDecimal("60.00");
    private static final BigDecimal THRESHOLD_80 = new BigDecimal("80.00");
    private static final BigDecimal THRESHOLD_50 = new BigDecimal("50.00");

    /**
     * Evaluates assessment metrics and generates relevant insights.
     */
    public List<MentorInsight> generateInsights(UUID userId, AssessmentMetric metrics) {
        List<MentorInsight> insights = new ArrayList<>();
        if (metrics == null) {
            return insights;
        }

        UUID resultId = metrics.getAssessmentResult().getId();

        // Technical < 60
        if (metrics.getTechnicalScore() != null && metrics.getTechnicalScore().compareTo(THRESHOLD_60) < 0) {
            insights.add(new MentorInsight(
                    userId,
                    "TECHNICAL",
                    "Technical Skill Gap Detected",
                    "Your technical score of " + metrics.getTechnicalScore() + "% is below 60%. Focus on fundamentals and complete core programming topics.",
                    2,
                    resultId
            ));
        }

        // Aptitude < 60
        if (metrics.getAptitudeScore() != null && metrics.getAptitudeScore().compareTo(THRESHOLD_60) < 0) {
            insights.add(new MentorInsight(
                    userId,
                    "APTITUDE",
                    "Cognitive Aptitude Improvement Needed",
                    "Your aptitude score of " + metrics.getAptitudeScore() + "% is below 60%. Try solving analytical reasoning and problem-solving exercises.",
                    2,
                    resultId
            ));
        }

        // Behavioral < 60
        if (metrics.getBehavioralScore() != null && metrics.getBehavioralScore().compareTo(THRESHOLD_60) < 0) {
            insights.add(new MentorInsight(
                    userId,
                    "BEHAVIORAL",
                    "Behavioral Alignment Check",
                    "Your behavioral score of " + metrics.getBehavioralScore() + "% is below 60%. Review collaboration scenarios and behavioral questions.",
                    1,
                    resultId
            ));
        }

        // Communication < 60
        if (metrics.getCommunicationScore() != null && metrics.getCommunicationScore().compareTo(THRESHOLD_60) < 0) {
            insights.add(new MentorInsight(
                    userId,
                    "COMMUNICATION",
                    "Communication Skills Reinforcement",
                    "Your communication score of " + metrics.getCommunicationScore() + "% is below 60%. Practice verbal reasoning and business English concepts.",
                    1,
                    resultId
            ));
        }

        // Readiness > 80 or < 50
        if (metrics.getDomainReadinessScore() != null) {
            BigDecimal readiness = metrics.getDomainReadinessScore();
            if (readiness.compareTo(THRESHOLD_80) > 0) {
                insights.add(new MentorInsight(
                        userId,
                        "READINESS",
                        "Strong Career Readiness",
                        "Excellent! Your readiness score of " + readiness + "% is above 80%. You show strong preparedness for placement opportunities.",
                        3,
                        resultId
                ));
            } else if (readiness.compareTo(THRESHOLD_50) < 0) {
                insights.add(new MentorInsight(
                        userId,
                        "READINESS",
                        "Domain Readiness Alert",
                        "Your domain readiness is currently low (" + readiness + "%). Target core concepts to elevate your placement preparation.",
                        2,
                        resultId
                ));
            }
        }

        return insights;
    }
}
