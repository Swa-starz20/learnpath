package com.learnpath.user.repository;

import com.learnpath.user.entity.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

/**
 * JPA repository for {@link UserProfile} entities.
 *
 * <p>Profiles are created by {@link com.learnpath.auth.service.AuthService}
 * during registration and owned by this repository — not cascade-saved via User.
 */
@Repository
public interface UserProfileRepository extends JpaRepository<UserProfile, UUID> {

    /**
     * Finds a profile by the owning user's ID.
     * Spring Data navigates the {@code user} association to its {@code id} field.
     */
    Optional<UserProfile> findByUser_Id(UUID userId);
}
