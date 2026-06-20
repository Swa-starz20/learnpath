package com.learnpath.domain.entity;

import jakarta.persistence.*;

import java.time.Instant;

/**
 * Engineering domain entity — the top-level discipline classifier.
 *
 * <p>Table: {@code domains}. Seeded with 12 engineering domains in V3 migration.
 */
@Entity
@Table(
    name = "domains",
    indexes = {
        @Index(name = "idx_domains_code",      columnList = "code"),
        @Index(name = "idx_domains_is_active",  columnList = "is_active")
    }
)
public class Domain {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "code", nullable = false, unique = true, length = 50)
    private String code;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "icon_name", length = 50)
    private String iconName;

    @Column(name = "is_active", nullable = false)
    private boolean active = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    // ── Lifecycle ─────────────────────────────────────────────────────────────

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

    protected Domain() {}

    public Domain(String code, String name, String description, String iconName) {
        this.code = code;
        this.name = name;
        this.description = description;
        this.iconName = iconName;
    }

    // ── Getters ───────────────────────────────────────────────────────────────

    public Long getId() { return id; }
    public String getCode() { return code; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public String getIconName() { return iconName; }
    public boolean isActive() { return active; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }

    // ── Setters ───────────────────────────────────────────────────────────────

    public void setActive(boolean active) { this.active = active; }
    public void setName(String name) { this.name = name; }
    public void setDescription(String description) { this.description = description; }
    public void setIconName(String iconName) { this.iconName = iconName; }
}
