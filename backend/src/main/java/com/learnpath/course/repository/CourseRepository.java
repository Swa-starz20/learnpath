package com.learnpath.course.repository;

import com.learnpath.course.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findByPublishedTrueOrderByTitleAsc();
    List<Course> findByDomainIdAndPublishedTrueOrderByTitleAsc(Long domainId);
    Optional<Course> findBySlug(String slug);
    boolean existsBySlug(String slug);
    List<Course> findByTitleContainingIgnoreCaseAndPublishedTrue(String query);
}
