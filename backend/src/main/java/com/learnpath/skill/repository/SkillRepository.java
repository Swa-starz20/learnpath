package com.learnpath.skill.repository;

import com.learnpath.skill.entity.Skill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SkillRepository extends JpaRepository<Skill, Long> {

    /** All skills for a given domain, ordered by name. */
    List<Skill> findByDomainIdOrderByNameAsc(Long domainId);

    /** All skills in a given category. */
    List<Skill> findByCategoryOrderByNameAsc(String category);

    List<Skill> findByNameContainingIgnoreCase(String query);
}
