package com.learnpath.placement.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "placement_targets")
public class PlacementTarget {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "profile_id", nullable = false)
    private PlacementProfile profile;

    @Column(name = "company_name", nullable = false, length = 255)
    private String companyName;

    @Column(name = "role_name", nullable = false, length = 255)
    private String roleName;

    @Column(name = "priority", nullable = false)
    private Integer priority = 1;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = Instant.now();
    }

    public PlacementTarget() {
    }

    public PlacementTarget(PlacementProfile profile, String companyName, String roleName, Integer priority) {
        this.profile = profile;
        this.companyName = companyName;
        this.roleName = roleName;
        this.priority = priority;
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

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }

    public Integer getPriority() {
        return priority;
    }

    public void setPriority(Integer priority) {
        this.priority = priority;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
