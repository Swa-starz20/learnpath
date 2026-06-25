package com.learnpath.analytics.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "analytics_predictions")
public class AnalyticsPrediction {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "prediction_type", nullable = false, length = 50)
    private String predictionType;

    @Column(name = "predicted_score", nullable = false, precision = 10, scale = 2)
    private BigDecimal predictedScore;

    @Column(name = "confidence", nullable = false, length = 20)
    private String confidence;

    @Column(name = "explanation", nullable = false, columnDefinition = "TEXT")
    private String explanation;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = Instant.now();
        }
    }

    public AnalyticsPrediction() {}

    public AnalyticsPrediction(UUID userId, String predictionType, BigDecimal predictedScore,
                               String confidence, String explanation) {
        this.userId = userId;
        this.predictionType = predictionType;
        this.predictedScore = predictedScore;
        this.confidence = confidence;
        this.explanation = explanation;
        this.createdAt = Instant.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }

    public String getPredictionType() { return predictionType; }
    public void setPredictionType(String predictionType) { this.predictionType = predictionType; }

    public BigDecimal getPredictedScore() { return predictedScore; }
    public void setPredictedScore(BigDecimal predictedScore) { this.predictedScore = predictedScore; }

    public String getConfidence() { return confidence; }
    public void setConfidence(String confidence) { this.confidence = confidence; }

    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
