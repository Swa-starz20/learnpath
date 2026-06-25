package com.learnpath.domain.repository;

import com.learnpath.domain.entity.Domain;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * JPA repository for {@link Domain} entities.
 */
@Repository
public interface DomainRepository extends JpaRepository<Domain, Long> {

    /** Returns all active domains ordered by name. */
    List<Domain> findByActiveTrueOrderByNameAsc();

    /** Finds a domain by its unique code (e.g. "COMP_ENG"). */
    Optional<Domain> findByCode(String code);

    /** Checks whether a domain with the given code exists. */
    boolean existsByCode(String code);

    List<Domain> findByNameContainingIgnoreCaseAndActiveTrue(String query);
}
