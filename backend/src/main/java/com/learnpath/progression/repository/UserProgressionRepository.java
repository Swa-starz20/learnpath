package com.learnpath.progression.repository;

import com.learnpath.progression.entity.UserProgression;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserProgressionRepository extends JpaRepository<UserProgression, Long> {

    /** Finds a user's progression record. */
    Optional<UserProgression> findByUserId(UUID userId);

    /** Checks if a progression record exists for a user. */
    boolean existsByUserId(UUID userId);
}
