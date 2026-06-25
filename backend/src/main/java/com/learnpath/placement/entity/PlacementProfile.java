package com.learnpath.placement.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(
    name = "placement_profiles",
    uniqueConstraints = {
        @UniqueConstraint(name = "uq_user_domain_placement", columnNames = {"user_id", "domain_id"})
    }
)
public class PlacementProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "domain_id")
    private Long domainId;

    @Column(name = "current_cgpa", precision = 4, scale = 2)
    private BigDecimal currentCgpa;

    @Column(name = "target_package_lpa", precision = 6, scale = 2)
    private BigDecimal targetPackageLpa;

    @Column(name = "preferred_location", length = 200)
    private String preferredLocation;

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

    public PlacementProfile() {
    }

    public PlacementProfile(UUID userId, Long domainId, BigDecimal currentCgpa, BigDecimal targetPackageLpa, String preferredLocation) {
        this.userId = userId;
        this.domainId = domainId;
        this.currentCgpa = currentCgpa;
        this.targetPackageLpa = targetPackageLpa;
        this.preferredLocation = preferredLocation;
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

    public Long getDomainId() {
        return domainId;
    }

    public void setDomainId(Long domainId) {
        this.domainId = domainId;
    }

    public BigDecimal getCurrentCgpa() {
        return currentCgpa;
    }

    public void setCurrentCgpa(BigDecimal currentCgpa) {
        this.currentCgpa = currentCgpa;
    }

    public BigDecimal getTargetPackageLpa() {
        return targetPackageLpa;
    }

    public void setTargetPackageLpa(BigDecimal targetPackageLpa) {
        this.targetPackageLpa = targetPackageLpa;
    }

    public String getPreferredLocation() {
        return preferredLocation;
    }

    public void setPreferredLocation(String preferredLocation) {
        this.preferredLocation = preferredLocation;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }
}
