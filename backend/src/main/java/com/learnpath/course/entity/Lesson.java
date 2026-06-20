package com.learnpath.course.entity;

import jakarta.persistence.*;

import java.time.Instant;

/**
 * An individual lesson within a course module.
 *
 * <p>Table: {@code lessons}
 */
@Entity
@Table(
    name = "lessons",
    indexes = {
        @Index(name = "idx_lessons_module", columnList = "module_id"),
        @Index(name = "idx_lessons_order",  columnList = "module_id, order_index")
    }
)
public class Lesson {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "module_id", nullable = false)
    private CourseModule module;

    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Column(name = "content_type", nullable = false, length = 30)
    private String contentType = "VIDEO";

    @Column(name = "content_url", length = 500)
    private String contentUrl;

    @Column(name = "order_index", nullable = false)
    private Integer orderIndex = 0;

    @Column(name = "duration_minutes")
    private Integer durationMinutes;

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

    protected Lesson() {}

    public Lesson(CourseModule module, String title, String contentType,
                  String contentUrl, Integer orderIndex, Integer durationMinutes) {
        this.module = module;
        this.title = title;
        this.contentType = contentType;
        this.contentUrl = contentUrl;
        this.orderIndex = orderIndex;
        this.durationMinutes = durationMinutes;
    }

    public Long getId() { return id; }
    public CourseModule getModule() { return module; }
    public String getTitle() { return title; }
    public String getContentType() { return contentType; }
    public String getContentUrl() { return contentUrl; }
    public Integer getOrderIndex() { return orderIndex; }
    public Integer getDurationMinutes() { return durationMinutes; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }

    public void setTitle(String title) { this.title = title; }
    public void setContentType(String contentType) { this.contentType = contentType; }
    public void setContentUrl(String contentUrl) { this.contentUrl = contentUrl; }
    public void setOrderIndex(Integer orderIndex) { this.orderIndex = orderIndex; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }
}
