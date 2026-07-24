package com.learnpath.skill.repository;

import com.learnpath.skill.entity.UserSkill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserSkillRepository extends JpaRepository<UserSkill, Long> {

    /** All skills assigned to a user. */
    List<UserSkill> findByUserIdOrderBySkillNameAsc(UUID userId);

    /** Checks whether a user already has this skill assigned. */
    boolean existsByUserIdAndSkillId(UUID userId, Long skillId);

    /** Finds a specific user-skill record. */
    Optional<UserSkill> findByUserIdAndSkillId(UUID userId, Long skillId);
}
