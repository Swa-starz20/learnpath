package com.learnpath.user.entity;

import jakarta.persistence.*;

/**
 * Platform role entity — e.g., STUDENT, ADMIN.
 *
 * <p>Seeded at startup via Flyway migration V2.
 * Table: {@code roles}
 */
@Entity
@Table(name = "roles")
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name", nullable = false, unique = true, length = 50)
    private String name;

    @Column(name = "description", length = 200)
    private String description;

    // ── Constructors ──────────────────────────────────────────────────────────

    protected Role() {
        // JPA
    }

    public Role(String name, String description) {
        this.name = name;
        this.description = description;
    }

    // ── Getters ──────────────────────────────────────────────────────────────

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getDescription() { return description; }

    // ── equals / hashCode (based on name — stable, unique field) ─────────────

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Role role)) return false;
        return name != null && name.equals(role.name);
    }

    @Override
    public int hashCode() {
        return name != null ? name.hashCode() : 0;
    }
}
