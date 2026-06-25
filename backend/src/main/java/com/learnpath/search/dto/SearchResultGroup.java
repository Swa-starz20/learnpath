package com.learnpath.search.dto;

import com.learnpath.course.dto.CourseResponse;
import com.learnpath.domain.dto.DomainResponse;
import com.learnpath.mentor.dto.MentorRecommendationResponse;
import com.learnpath.placement.dto.PlacementTargetResponse;
import com.learnpath.roadmap.dto.CareerTrackResponse;
import com.learnpath.skill.dto.SkillResponse;

import java.util.List;

public record SearchResultGroup(
        List<SkillResponse> skills,
        List<CourseResponse> courses,
        List<DomainResponse> domains,
        List<CareerTrackResponse> roadmaps,
        List<MentorRecommendationResponse> mentorRecommendations,
        List<PlacementTargetResponse> placementTargets
) {}
