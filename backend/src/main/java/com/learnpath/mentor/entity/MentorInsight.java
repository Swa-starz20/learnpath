package com.learnpath.mentor.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "mentor_insights")
public class MentorInsight {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "insight_type", nullable = false, length = 100)
    private String insightType;

    @Column(name = "title", nullable = false, length = 255)
    private String title;

    @Column(name = "description", nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "priority", nullable = false)
    private Integer priority = 1;

    @Column(name = "generated_at", nullable = false, updatable = false)
    private Instant generatedAt;

    @PrePersist
    protected void onCreate() {
        this.generatedAt = Instant.now();
    }

    public MentorInsight() {
    }

    public MentorInsight(UUID userId, String insightType, String title, String description, Integer priority) {
        this.userId = userId;
        this.insightType = insightType;
        this.title = title;
        this.description = description;
        this.priority = priority;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public String getInsightType() {
        return insightType;
    }

    public void setInsightType(String insightType) {
        this.insightType = insightType;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getPriority() {
        return priority;
    }

    public void setPriority(Integer priority) {
        this.priority = priority;
    }

    public Instant getGeneratedAt() {
        return generatedAt;
    }
}
