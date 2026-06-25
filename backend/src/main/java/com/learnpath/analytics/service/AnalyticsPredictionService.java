package com.learnpath.analytics.service;

import com.learnpath.analytics.entity.AnalyticsPrediction;
import com.learnpath.analytics.entity.AnalyticsSnapshot;
import com.learnpath.analytics.repository.AnalyticsPredictionRepository;
import com.learnpath.analytics.repository.AnalyticsSnapshotRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class AnalyticsPredictionService {

    private static final Logger log = LoggerFactory.getLogger(AnalyticsPredictionService.class);

    private final AnalyticsPredictionRepository predictionRepository;
    private final AnalyticsSnapshotRepository snapshotRepository;

    public AnalyticsPredictionService(AnalyticsPredictionRepository predictionRepository,
                                      AnalyticsSnapshotRepository snapshotRepository) {
        this.predictionRepository = predictionRepository;
        this.snapshotRepository = snapshotRepository;
    }

    @Transactional
    public List<AnalyticsPrediction> generatePredictions(UUID userId) {
        log.info("Generating predictions for user: {}", userId);
        List<AnalyticsSnapshot> snapshots = snapshotRepository.findByUserIdOrderBySnapshotTimeDesc(userId);

        if (snapshots.isEmpty()) {
            log.warn("No snapshots found for user {}, skipping prediction generation", userId);
            return List.of();
        }

        AnalyticsSnapshot latest = snapshots.get(0);
        AnalyticsSnapshot previous = snapshots.size() > 1 ? snapshots.get(1) : null;

        List<AnalyticsPrediction> predictions = new ArrayList<>();

        predictions.add(predictReadiness(userId, latest, previous, snapshots.size()));
        predictions.add(predictRoadmapCompletion(userId, latest, previous, snapshots.size()));
        predictions.add(predictMastery(userId, latest, previous, snapshots.size()));
        predictions.add(predictXp(userId, latest, previous, snapshots.size()));

        // Remove old predictions first
        List<AnalyticsPrediction> old = predictionRepository.findByUserIdOrderByCreatedAtDesc(userId);
        if (!old.isEmpty()) {
            predictionRepository.deleteAll(old);
            predictionRepository.flush();
        }

        return predictionRepository.saveAll(predictions);
    }

    private AnalyticsPrediction predictReadiness(UUID userId, AnalyticsSnapshot latest, AnalyticsSnapshot previous, int count) {
        BigDecimal current = latest.getReadinessScore();
        BigDecimal predicted;
        String confidence = "MEDIUM";
        String explanation;

        if (previous == null) {
            predicted = current.add(BigDecimal.valueOf(2.00));
            explanation = "Your placement readiness score is forecasted to reach " + predicted.setScale(2, RoundingMode.HALF_UP) + "% next month based on initial baseline metrics.";
        } else {
            BigDecimal delta = current.subtract(previous.getReadinessScore());
            if (delta.compareTo(BigDecimal.ZERO) > 0) {
                predicted = current.add(delta.multiply(BigDecimal.valueOf(1.2)));
                confidence = "HIGH";
                explanation = "Your placement readiness is trending upward. Sustaining this rate will lead to an estimated score of " + predicted.setScale(2, RoundingMode.HALF_UP) + "% next month.";
            } else {
                predicted = current.add(BigDecimal.valueOf(1.00));
                confidence = "LOW";
                explanation = "Your placement readiness score has stabilized. Reaching a projected score of " + predicted.setScale(2, RoundingMode.HALF_UP) + "% next month will require active participation.";
            }
        }

        if (predicted.compareTo(BigDecimal.valueOf(100.00)) > 0) {
            predicted = BigDecimal.valueOf(100.00);
        }
        if (predicted.compareTo(BigDecimal.ZERO) < 0) {
            predicted = BigDecimal.ZERO;
        }

        return new AnalyticsPrediction(userId, "READINESS_FORECAST", predicted.setScale(2, RoundingMode.HALF_UP), confidence, explanation);
    }

    private AnalyticsPrediction predictRoadmapCompletion(UUID userId, AnalyticsSnapshot latest, AnalyticsSnapshot previous, int count) {
        BigDecimal current = latest.getRoadmapCompletion();
        BigDecimal predicted;
        String confidence = "MEDIUM";
        String explanation;

        if (current.compareTo(BigDecimal.valueOf(100.00)) >= 0) {
            predicted = BigDecimal.valueOf(100.00);
            confidence = "HIGH";
            explanation = "You have already completed 100% of your learning roadmap.";
        } else if (previous == null) {
            predicted = current.add(BigDecimal.valueOf(3.00));
            explanation = "Your roadmap completion is projected to reach " + predicted.setScale(2, RoundingMode.HALF_UP) + "% next month based on early activity.";
        } else {
            BigDecimal delta = current.subtract(previous.getRoadmapCompletion());
            if (delta.compareTo(BigDecimal.ZERO) > 0) {
                predicted = current.add(delta.multiply(BigDecimal.valueOf(1.5)));
                confidence = "HIGH";
                explanation = "Roadmap completion is projected to reach " + predicted.setScale(2, RoundingMode.HALF_UP) + "% next month if your current progress rate is sustained.";
            } else {
                predicted = current.add(BigDecimal.valueOf(2.00));
                confidence = "LOW";
                explanation = "Roadmap progress is currently stable. Complete new roadmap nodes to hit your projected " + predicted.setScale(2, RoundingMode.HALF_UP) + "% completion.";
            }
        }

        if (predicted.compareTo(BigDecimal.valueOf(100.00)) > 0) {
            predicted = BigDecimal.valueOf(100.00);
        }
        if (predicted.compareTo(BigDecimal.ZERO) < 0) {
            predicted = BigDecimal.ZERO;
        }

        return new AnalyticsPrediction(userId, "ROADMAP_COMPLETION_ESTIMATE", predicted.setScale(2, RoundingMode.HALF_UP), confidence, explanation);
    }

    private AnalyticsPrediction predictMastery(UUID userId, AnalyticsSnapshot latest, AnalyticsSnapshot previous, int count) {
        BigDecimal current = latest.getMasteryScore();
        BigDecimal predicted;
        String confidence = "MEDIUM";
        String explanation;

        if (current.compareTo(BigDecimal.valueOf(100.00)) >= 0) {
            predicted = BigDecimal.valueOf(100.00);
            confidence = "HIGH";
            explanation = "You have achieved full mastery in your core engineering domains.";
        } else if (previous == null) {
            predicted = current.add(BigDecimal.valueOf(2.50));
            explanation = "Mastery is estimated to grow to " + predicted.setScale(2, RoundingMode.HALF_UP) + "% next month based on initial skill progression.";
        } else {
            BigDecimal delta = current.subtract(previous.getMasteryScore());
            if (delta.compareTo(BigDecimal.ZERO) > 0) {
                predicted = current.add(delta.multiply(BigDecimal.valueOf(1.3)));
                confidence = "HIGH";
                explanation = "Mastery score is projected to grow to " + predicted.setScale(2, RoundingMode.HALF_UP) + "% next month following strong learning outcomes.";
            } else {
                predicted = current.add(BigDecimal.valueOf(1.50));
                confidence = "LOW";
                explanation = "Your mastery progression has stabilized. Targeted lessons can help push your mastery level towards the projected " + predicted.setScale(2, RoundingMode.HALF_UP) + "% next month.";
            }
        }

        if (predicted.compareTo(BigDecimal.valueOf(100.00)) > 0) {
            predicted = BigDecimal.valueOf(100.00);
        }
        if (predicted.compareTo(BigDecimal.ZERO) < 0) {
            predicted = BigDecimal.ZERO;
        }

        return new AnalyticsPrediction(userId, "MASTERY_EXPECTATION", predicted.setScale(2, RoundingMode.HALF_UP), confidence, explanation);
    }

    private AnalyticsPrediction predictXp(UUID userId, AnalyticsSnapshot latest, AnalyticsSnapshot previous, int count) {
        int current = latest.getTotalXp();
        int predictedVal;
        String confidence = "MEDIUM";
        String explanation;

        if (previous == null) {
            predictedVal = current + 150;
            explanation = "You are expected to reach " + predictedVal + " total XP next month based on standard starting velocity.";
        } else {
            int delta = current - previous.getTotalXp();
            if (delta > 0) {
                predictedVal = current + (int) (delta * 1.4);
                confidence = "HIGH";
                explanation = "With your increasing learning pace, you are projected to accumulate " + predictedVal + " total XP by next month.";
            } else {
                predictedVal = current + 100;
                confidence = "LOW";
                explanation = "Your learning XP gains have slowed down. Completing quizzes and courses is expected to raise your XP to " + predictedVal + " next month.";
            }
        }

        if (predictedVal < 0) {
            predictedVal = 0;
        }

        BigDecimal score = BigDecimal.valueOf(predictedVal);

        return new AnalyticsPrediction(userId, "XP_EXPECTATION", score.setScale(2, RoundingMode.HALF_UP), confidence, explanation);
    }
}
