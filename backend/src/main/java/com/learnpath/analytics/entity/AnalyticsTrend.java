package com.learnpath.analytics.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "analytics_trends")
public class AnalyticsTrend {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "metric_name", nullable = false, length = 50)
    private String metricName;

    @Column(name = "previous_value", nullable = false, precision = 5, scale = 2)
    private BigDecimal previousValue;

    @Column(name = "current_value", nullable = false, precision = 5, scale = 2)
    private BigDecimal currentValue;

    @Column(name = "trend_direction", nullable = false, length = 20)
    private String trendDirection;

    @Column(name = "improvement_percent", nullable = false, precision = 5, scale = 2)
    private BigDecimal improvementPercent;

    @Column(name = "calculated_at", nullable = false)
    private Instant calculatedAt;

    @PrePersist
    protected void onCreate() {
        if (this.calculatedAt == null) {
            this.calculatedAt = Instant.now();
        }
    }

    public AnalyticsTrend() {}

    public AnalyticsTrend(UUID userId, String metricName, BigDecimal previousValue, BigDecimal currentValue,
                          String trendDirection, BigDecimal improvementPercent) {
        this.userId = userId;
        this.metricName = metricName;
        this.previousValue = previousValue;
        this.currentValue = currentValue;
        this.trendDirection = trendDirection;
        this.improvementPercent = improvementPercent;
        this.calculatedAt = Instant.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }

    public String getMetricName() { return metricName; }
    public void setMetricName(String metricName) { this.metricName = metricName; }

    public BigDecimal getPreviousValue() { return previousValue; }
    public void setPreviousValue(BigDecimal previousValue) { this.previousValue = previousValue; }

    public BigDecimal getCurrentValue() { return currentValue; }
    public void setCurrentValue(BigDecimal currentValue) { this.currentValue = currentValue; }

    public String getTrendDirection() { return trendDirection; }
    public void setTrendDirection(String trendDirection) { this.trendDirection = trendDirection; }

    public BigDecimal getImprovementPercent() { return improvementPercent; }
    public void setImprovementPercent(BigDecimal improvementPercent) { this.improvementPercent = improvementPercent; }

    public Instant getCalculatedAt() { return calculatedAt; }
    public void setCalculatedAt(Instant calculatedAt) { this.calculatedAt = calculatedAt; }
}
