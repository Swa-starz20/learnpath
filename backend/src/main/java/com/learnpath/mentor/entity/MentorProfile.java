package com.learnpath.mentor.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "mentor_profiles")
public class MentorProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "user_id", nullable = false, unique = true)
    private UUID userId;

    @Column(name = "primary_domain_id")
    private Long primaryDomainId;

    @Column(name = "current_level", length = 50)
    private String currentLevel;

    @Column(name = "target_role", length = 200)
    private String targetRole;

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

    public MentorProfile() {
    }

    public MentorProfile(UUID userId, Long primaryDomainId, String currentLevel, String targetRole) {
        this.userId = userId;
        this.primaryDomainId = primaryDomainId;
        this.currentLevel = currentLevel;
        this.targetRole = targetRole;
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

    public Long getPrimaryDomainId() {
        return primaryDomainId;
    }

    public void setPrimaryDomainId(Long primaryDomainId) {
        this.primaryDomainId = primaryDomainId;
    }

    public String getCurrentLevel() {
        return currentLevel;
    }

    public void setCurrentLevel(String currentLevel) {
        this.currentLevel = currentLevel;
    }

    public String getTargetRole() {
        return targetRole;
    }

    public void setTargetRole(String targetRole) {
        this.targetRole = targetRole;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }
}
