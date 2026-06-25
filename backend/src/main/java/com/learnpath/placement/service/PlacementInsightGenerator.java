package com.learnpath.placement.service;

import com.learnpath.assessment.entity.AssessmentMetric;
import com.learnpath.placement.entity.PlacementInsight;
import com.learnpath.placement.entity.PlacementProfile;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Component
public class PlacementInsightGenerator {

    public List<PlacementInsight> generateInsights(UUID userId, PlacementProfile profile, UUID assessmentResultId, AssessmentMetric metric) {
        List<PlacementInsight> insights = new ArrayList<>();

        if (metric == null) return insights;

        // 1. Technical Score
        if (metric.getTechnicalScore() != null) {
            BigDecimal score = metric.getTechnicalScore();
            if (score.compareTo(new BigDecimal("80.00")) >= 0) {
                insights.add(new PlacementInsight(userId, profile, assessmentResultId, "STRENGTH", "TECHNICAL",
                        "Strong Technical Readiness",
                        "Your technical score of " + score + "% shows strong technical readiness."));
            } else if (score.compareTo(new BigDecimal("50.00")) < 0) {
                insights.add(new PlacementInsight(userId, profile, assessmentResultId, "WEAKNESS", "TECHNICAL",
                        "Technical Gap",
                        "Your technical score of " + score + "% is below the target threshold."));
            }
        }

        // 2. Aptitude Score
        if (metric.getAptitudeScore() != null) {
            BigDecimal score = metric.getAptitudeScore();
            if (score.compareTo(new BigDecimal("80.00")) >= 0) {
                insights.add(new PlacementInsight(userId, profile, assessmentResultId, "STRENGTH", "APTITUDE",
                        "Strong Quantitative/Aptitude Readiness",
                        "Your aptitude score of " + score + "% shows excellent analytical capacity."));
            } else if (score.compareTo(new BigDecimal("50.00")) < 0) {
                insights.add(new PlacementInsight(userId, profile, assessmentResultId, "WEAKNESS", "APTITUDE",
                        "Low Aptitude Readiness",
                        "Your aptitude score of " + score + "% indicates a need for quantitative practice."));
            }
        }

        // 3. Communication Score
        if (metric.getCommunicationScore() != null) {
            BigDecimal score = metric.getCommunicationScore();
            if (score.compareTo(new BigDecimal("80.00")) >= 0) {
                insights.add(new PlacementInsight(userId, profile, assessmentResultId, "STRENGTH", "COMMUNICATION",
                        "Strong Communication Readiness",
                        "Your communication score of " + score + "% indicates high soft skill readiness."));
            } else if (score.compareTo(new BigDecimal("50.00")) < 0) {
                insights.add(new PlacementInsight(userId, profile, assessmentResultId, "WEAKNESS", "COMMUNICATION",
                        "Communication Weakness",
                        "Your communication score of " + score + "% is below the ideal threshold for team collaboration."));
            }
        }

        // 4. Behavioral Score
        if (metric.getBehavioralScore() != null) {
            BigDecimal score = metric.getBehavioralScore();
            if (score.compareTo(new BigDecimal("80.00")) >= 0) {
                insights.add(new PlacementInsight(userId, profile, assessmentResultId, "STRENGTH", "BEHAVIORAL",
                        "Strong Behavioral Match",
                        "Your behavioral score of " + score + "% shows strong professional adaptability."));
            } else if (score.compareTo(new BigDecimal("50.00")) < 0) {
                insights.add(new PlacementInsight(userId, profile, assessmentResultId, "WEAKNESS", "BEHAVIORAL",
                        "Behavioral Alignment Need",
                        "Your behavioral score of " + score + "% is below the recommended threshold."));
            }
        }

        // 5. Overall Score / Warning
        if (metric.getOverallScore() != null) {
            BigDecimal score = metric.getOverallScore();
            if (score.compareTo(new BigDecimal("60.00")) < 0) {
                insights.add(new PlacementInsight(userId, profile, assessmentResultId, "WARNING", "OVERALL",
                        "Interview Readiness Risk",
                        "Your overall readiness score is " + score + "%, indicating significant risk for upcoming placement interviews."));
            }
        }

        return insights;
    }
}
