package com.learnpath.course.entity;

import jakarta.persistence.*;

import java.time.Instant;

/**
 * A module (chapter) within a course.
 *
 * <p>Table: {@code course_modules}
 */
@Entity
@Table(
    name = "course_modules",
    indexes = {
        @Index(name = "idx_course_modules_course", columnList = "course_id"),
        @Index(name = "idx_course_modules_order",  columnList = "course_id, order_index")
    }
)
public class CourseModule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "order_index", nullable = false)
    private Integer orderIndex = 0;

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
    protected void onUpdate() { this.updatedAt = Instant.now(); }

    protected CourseModule() {}

    public CourseModule(Course course, String title, String description, Integer orderIndex) {
        this.course = course;
        this.title = title;
        this.description = description;
        this.orderIndex = orderIndex;
    }

    public Long getId() { return id; }
    public Course getCourse() { return course; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public Integer getOrderIndex() { return orderIndex; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }

    public void setTitle(String title) { this.title = title; }
    public void setDescription(String description) { this.description = description; }
    public void setOrderIndex(Integer orderIndex) { this.orderIndex = orderIndex; }
}
