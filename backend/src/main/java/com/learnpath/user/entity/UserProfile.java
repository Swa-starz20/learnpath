package com.learnpath.user.entity;

import jakarta.persistence.*;

import java.time.Instant;
import java.util.UUID;

/**
 * Extended user profile — additional preferences and metadata.
 *
 * <p>Separated from {@link User} to keep the identity entity lean.
 * Created automatically on registration.
 *
 * <p>Table: {@code user_profiles}
 */
@Entity
@Table(name = "user_profiles")
public class UserProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "avatar_url", length = 500)
    private String avatarUrl;

    @Column(name = "timezone", length = 60)
    private String timezone;

    @Column(name = "preferred_language", length = 10)
    private String preferredLanguage;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    // ── Lifecycle ────────────────────────────────────────────────────────────

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

    // ── Constructors ──────────────────────────────────────────────────────────

    protected UserProfile() {
        // JPA
    }

    /** Creates a default profile for a newly registered user. */
    public static UserProfile createDefault(User user) {
        UserProfile profile = new UserProfile();
        profile.user = user;
        profile.timezone = "UTC";
        profile.preferredLanguage = "en";
        return profile;
    }

    // ── Getters ──────────────────────────────────────────────────────────────

    public UUID getId() { return id; }
    public User getUser() { return user; }
    public String getAvatarUrl() { return avatarUrl; }
    public String getTimezone() { return timezone; }
    public String getPreferredLanguage() { return preferredLanguage; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }

    // ── Setters ───────────────────────────────────────────────────────────────

    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
    public void setTimezone(String timezone) { this.timezone = timezone; }
    public void setPreferredLanguage(String preferredLanguage) { this.preferredLanguage = preferredLanguage; }
}
