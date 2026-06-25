package com.learnpath.notification.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "notification_preferences")
public class NotificationPreference {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "user_id", nullable = false, unique = true)
    private UUID userId;

    @Column(name = "assessment_notifications", nullable = false)
    private boolean assessmentNotifications = true;

    @Column(name = "mentor_notifications", nullable = false)
    private boolean mentorNotifications = true;

    @Column(name = "placement_notifications", nullable = false)
    private boolean placementNotifications = true;

    @Column(name = "analytics_notifications", nullable = false)
    private boolean analyticsNotifications = true;

    @Column(name = "roadmap_notifications", nullable = false)
    private boolean roadmapNotifications = true;

    @Column(name = "email_enabled", nullable = false)
    private boolean emailEnabled = true;

    @Column(name = "in_app_enabled", nullable = false)
    private boolean inAppEnabled = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @PrePersist
    protected void onCreate() {
        Instant now = Instant.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = Instant.now();
    }

    public NotificationPreference() {}

    public NotificationPreference(UUID userId) {
        this.userId = userId;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }

    public boolean isAssessmentNotifications() { return assessmentNotifications; }
    public void setAssessmentNotifications(boolean assessmentNotifications) { this.assessmentNotifications = assessmentNotifications; }

    public boolean isMentorNotifications() { return mentorNotifications; }
    public void setMentorNotifications(boolean mentorNotifications) { this.mentorNotifications = mentorNotifications; }

    public boolean isPlacementNotifications() { return placementNotifications; }
    public void setPlacementNotifications(boolean placementNotifications) { this.placementNotifications = placementNotifications; }

    public boolean isAnalyticsNotifications() { return analyticsNotifications; }
    public void setAnalyticsNotifications(boolean analyticsNotifications) { this.analyticsNotifications = analyticsNotifications; }

    public boolean isRoadmapNotifications() { return roadmapNotifications; }
    public void setRoadmapNotifications(boolean roadmapNotifications) { this.roadmapNotifications = roadmapNotifications; }

    public boolean isEmailEnabled() { return emailEnabled; }
    public void setEmailEnabled(boolean emailEnabled) { this.emailEnabled = emailEnabled; }

    public boolean isInAppEnabled() { return inAppEnabled; }
    public void setInAppEnabled(boolean inAppEnabled) { this.inAppEnabled = inAppEnabled; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
