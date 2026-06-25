package com.learnpath.placement.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "placement_preferences")
public class PlacementPreference {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "profile_id", nullable = false, unique = true)
    private PlacementProfile profile;

    @Column(name = "prefers_remote", nullable = false)
    private boolean prefersRemote = false;

    @Column(name = "prefers_hybrid", nullable = false)
    private boolean prefersHybrid = false;

    @Column(name = "prefers_onsite", nullable = false)
    private boolean prefersOnsite = false;

    @Column(name = "preferred_company_size", length = 50)
    private String preferredCompanySize;

    @Column(name = "preferred_industry", length = 100)
    private String preferredIndustry;

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

    public PlacementPreference() {
    }

    public PlacementPreference(PlacementProfile profile) {
        this.profile = profile;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public PlacementProfile getProfile() {
        return profile;
    }

    public void setProfile(PlacementProfile profile) {
        this.profile = profile;
    }

    public boolean isPrefersRemote() {
        return prefersRemote;
    }

    public void setPrefersRemote(boolean prefersRemote) {
        this.prefersRemote = prefersRemote;
    }

    public boolean isPrefersHybrid() {
        return prefersHybrid;
    }

    public void setPrefersHybrid(boolean prefersHybrid) {
        this.prefersHybrid = prefersHybrid;
    }

    public boolean isPrefersOnsite() {
        return prefersOnsite;
    }

    public void setPrefersOnsite(boolean prefersOnsite) {
        this.prefersOnsite = prefersOnsite;
    }

    public String getPreferredCompanySize() {
        return preferredCompanySize;
    }

    public void setPreferredCompanySize(String preferredCompanySize) {
        this.preferredCompanySize = preferredCompanySize;
    }

    public String getPreferredIndustry() {
        return preferredIndustry;
    }

    public void setPreferredIndustry(String preferredIndustry) {
        this.preferredIndustry = preferredIndustry;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }
}
