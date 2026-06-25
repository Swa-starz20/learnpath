package com.learnpath.analytics.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "analytics_insights")
public class AnalyticsInsight {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "insight_type", nullable = false, length = 50)
    private String insightType;

    @Column(name = "title", nullable = false, length = 255)
    private String title;

    @Column(name = "description", nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "priority", nullable = false, length = 20)
    private String priority;

    @Column(name = "generated_at", nullable = false)
    private Instant generatedAt;

    @Column(name = "assessment_result_id")
    private UUID assessmentResultId;

    @Column(name = "snapshot_id")
    private UUID snapshotId;

    @PrePersist
    protected void onCreate() {
        if (this.generatedAt == null) {
            this.generatedAt = Instant.now();
        }
    }

    public AnalyticsInsight() {}

    public AnalyticsInsight(UUID userId, String insightType, String title, String description,
                            String priority, UUID assessmentResultId, UUID snapshotId) {
        this.userId = userId;
        this.insightType = insightType;
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.assessmentResultId = assessmentResultId;
        this.snapshotId = snapshotId;
        this.generatedAt = Instant.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }

    public String getInsightType() { return insightType; }
    public void setInsightType(String insightType) { this.insightType = insightType; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public Instant getGeneratedAt() { return generatedAt; }
    public void setGeneratedAt(Instant generatedAt) { this.generatedAt = generatedAt; }

    public UUID getAssessmentResultId() { return assessmentResultId; }
    public void setAssessmentResultId(UUID assessmentResultId) { this.assessmentResultId = assessmentResultId; }

    public UUID getSnapshotId() { return snapshotId; }
    public void setSnapshotId(UUID snapshotId) { this.snapshotId = snapshotId; }
}
