package com.learnpath.skill.entity;

import com.learnpath.domain.entity.Domain;
import jakarta.persistence.*;

import java.time.Instant;

/**
 * A learnable skill within an engineering domain.
 *
 * <p>Table: {@code skills}
 */
@Entity
@Table(
    name = "skills",
    indexes = {
        @Index(name = "idx_skills_domain_id", columnList = "domain_id"),
        @Index(name = "idx_skills_category",  columnList = "category")
    }
)
public class Skill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "domain_id", nullable = false)
    private Domain domain;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "category", length = 50)
    private String category;

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

    protected Skill() {}

    public Skill(Domain domain, String name, String description, String category) {
        this.domain = domain;
        this.name = name;
        this.description = description;
        this.category = category;
    }

    public Long getId() { return id; }
    public Domain getDomain() { return domain; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public String getCategory() { return category; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }

    public void setName(String name) { this.name = name; }
    public void setDescription(String description) { this.description = description; }
    public void setCategory(String category) { this.category = category; }
}
