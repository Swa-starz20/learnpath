package com.learnpath.skill.controller;

import com.learnpath.common.response.ApiResponse;
import com.learnpath.exception.AuthenticationException;
import com.learnpath.security.UserPrincipal;
import com.learnpath.skill.dto.AssignSkillRequest;
import com.learnpath.skill.dto.SkillResponse;
import com.learnpath.skill.dto.UserSkillResponse;
import com.learnpath.skill.service.SkillService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for skill management.
 *
 * <p>Base path: {@code /api/v1/skills}
 */
@RestController
@RequestMapping("/api/v1/skills")
public class SkillController {

    private final SkillService skillService;

    public SkillController(SkillService skillService) {
        this.skillService = skillService;
    }

    /** GET /api/v1/skills — list all skills, optionally filtered by domainId. */
    @GetMapping
    public ResponseEntity<ApiResponse<List<SkillResponse>>> listSkills(
            @RequestParam(required = false) Long domainId) {
        return ResponseEntity.ok(ApiResponse.ok(skillService.listSkills(domainId)));
    }

    /** GET /api/v1/skills/{id} — get a single skill. */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SkillResponse>> getSkill(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(skillService.getSkillById(id)));
    }

    /** GET /api/v1/skills/my — list the current user's skills. */
    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<UserSkillResponse>>> mySkills(
            @AuthenticationPrincipal UserPrincipal principal) {
        if (principal == null) throw new AuthenticationException("Authentication required.");
        return ResponseEntity.ok(ApiResponse.ok(skillService.listUserSkills(principal.getId())));
    }

    /** POST /api/v1/skills/my — assign a skill to the current user. */
    @PostMapping("/my")
    public ResponseEntity<ApiResponse<UserSkillResponse>> assignSkill(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody AssignSkillRequest request) {
        if (principal == null) throw new AuthenticationException("Authentication required.");
        UserSkillResponse response = skillService.assignSkill(principal.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(response, "Skill assigned."));
    }
}
