package com.learnpath.user.repository;

import com.learnpath.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

/**
 * JPA repository for {@link User} entities.
 */
@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    /**
     * Finds a user by their email address.
     * Used during login and duplicate-check on registration.
     */
    Optional<User> findByEmail(String email);

    /**
     * Checks whether a user with the given email exists.
     * More efficient than {@link #findByEmail} when you only need the boolean.
     */
    boolean existsByEmail(String email);

    /**
     * Fetches a user with roles eagerly loaded in a single query.
     * Avoids the N+1 issue when loading roles for JWT generation.
     */
    @Query("SELECT u FROM User u JOIN FETCH u.roles WHERE u.id = :id")
    Optional<User> findByIdWithRoles(@Param("id") UUID id);

    /**
     * Fetches a user by email with roles eagerly loaded.
     */
    @Query("SELECT u FROM User u JOIN FETCH u.roles WHERE u.email = :email")
    Optional<User> findByEmailWithRoles(@Param("email") String email);
}
