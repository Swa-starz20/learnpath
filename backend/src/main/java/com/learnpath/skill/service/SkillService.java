package com.learnpath.skill.service;

import com.learnpath.exception.DuplicateResourceException;
import com.learnpath.exception.ResourceNotFoundException;
import com.learnpath.skill.dto.AssignSkillRequest;
import com.learnpath.skill.dto.SkillResponse;
import com.learnpath.skill.dto.UserSkillResponse;
import com.learnpath.skill.entity.Skill;
import com.learnpath.skill.entity.UserSkill;
import com.learnpath.skill.repository.SkillRepository;
import com.learnpath.skill.repository.UserSkillRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Service for skill management and user-skill tracking.
 */
@Service
public class SkillService {

    private final SkillRepository skillRepository;
    private final UserSkillRepository userSkillRepository;

    public SkillService(SkillRepository skillRepository,
                        UserSkillRepository userSkillRepository) {
        this.skillRepository = skillRepository;
        this.userSkillRepository = userSkillRepository;
    }

    @Transactional(readOnly = true)
    public List<SkillResponse> listSkills(Long domainId) {
        List<Skill> skills = (domainId != null)
                ? skillRepository.findByDomainIdOrderByNameAsc(domainId)
                : skillRepository.findAll();
        return skills.stream().map(SkillResponse::from).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public SkillResponse getSkillById(Long id) {
        Skill skill = skillRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Skill", "id", id));
        return SkillResponse.from(skill);
    }

    @Transactional(readOnly = true)
    public List<UserSkillResponse> listUserSkills(UUID userId) {
        return userSkillRepository.findByUserIdOrderBySkillNameAsc(userId)
                .stream()
                .map(UserSkillResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public UserSkillResponse assignSkill(UUID userId, AssignSkillRequest request) {
        Long skillId = request.skillId();
        if (userSkillRepository.existsByUserIdAndSkillId(userId, skillId)) {
            throw new DuplicateResourceException("Skill " + skillId + " is already assigned to this user.");
        }
        Skill skill = skillRepository.findById(skillId)
                .orElseThrow(() -> new ResourceNotFoundException("Skill", "id", skillId));
        UserSkill userSkill = new UserSkill(userId, skill);
        return UserSkillResponse.from(userSkillRepository.save(userSkill));
    }
}
