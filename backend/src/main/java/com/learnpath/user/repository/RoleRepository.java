package com.learnpath.user.repository;

import com.learnpath.user.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * JPA repository for {@link Role} entities.
 */
@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {

    /**
     * Finds a role by its name (e.g., "STUDENT", "ADMIN").
     */
    Optional<Role> findByName(String name);
}
