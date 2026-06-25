package com.learnpath.search.service;

import com.learnpath.course.dto.CourseResponse;
import com.learnpath.course.repository.CourseRepository;
import com.learnpath.domain.dto.DomainResponse;
import com.learnpath.domain.repository.DomainRepository;
import com.learnpath.mentor.dto.MentorRecommendationResponse;
import com.learnpath.mentor.repository.MentorRecommendationRepository;
import com.learnpath.placement.dto.PlacementTargetResponse;
import com.learnpath.placement.repository.PlacementTargetRepository;
import com.learnpath.roadmap.dto.CareerTrackResponse;
import com.learnpath.roadmap.repository.CareerTrackRepository;
import com.learnpath.search.dto.SearchResultGroup;
import com.learnpath.skill.dto.SkillResponse;
import com.learnpath.skill.repository.SkillRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class SearchService {

    private static final Logger log = LoggerFactory.getLogger(SearchService.class);

    private final SkillRepository skillRepository;
    private final CourseRepository courseRepository;
    private final DomainRepository domainRepository;
    private final CareerTrackRepository careerTrackRepository;
    private final MentorRecommendationRepository mentorRecommendationRepository;
    private final PlacementTargetRepository placementTargetRepository;

    public SearchService(
            SkillRepository skillRepository,
            CourseRepository courseRepository,
            DomainRepository domainRepository,
            CareerTrackRepository careerTrackRepository,
            MentorRecommendationRepository mentorRecommendationRepository,
            PlacementTargetRepository placementTargetRepository) {
        this.skillRepository = skillRepository;
        this.courseRepository = courseRepository;
        this.domainRepository = domainRepository;
        this.careerTrackRepository = careerTrackRepository;
        this.mentorRecommendationRepository = mentorRecommendationRepository;
        this.placementTargetRepository = placementTargetRepository;
    }

    @Transactional(readOnly = true)
    public SearchResultGroup search(UUID userId, String query) {
        log.info("Performing global search for user: {}, query: '{}'", userId, query);
        if (query == null || query.trim().isEmpty()) {
            return new SearchResultGroup(
                    List.of(), List.of(), List.of(), List.of(), List.of(), List.of()
            );
        }

        String searchPattern = query.trim();

        List<SkillResponse> skills = skillRepository.findByNameContainingIgnoreCase(searchPattern).stream()
                .map(SkillResponse::from)
                .toList();

        List<CourseResponse> courses = courseRepository.findByTitleContainingIgnoreCaseAndPublishedTrue(searchPattern).stream()
                .map(CourseResponse::from)
                .toList();

        List<DomainResponse> domains = domainRepository.findByNameContainingIgnoreCaseAndActiveTrue(searchPattern).stream()
                .map(DomainResponse::from)
                .toList();

        List<CareerTrackResponse> roadmaps = careerTrackRepository.findByNameContainingIgnoreCaseAndActiveTrue(searchPattern).stream()
                .map(CareerTrackResponse::from)
                .toList();

        List<MentorRecommendationResponse> mentorRecommendations = mentorRecommendationRepository
                .findByUserIdAndTitleContainingIgnoreCaseOrUserIdAndDescriptionContainingIgnoreCase(userId, searchPattern, userId, searchPattern).stream()
                .map(MentorRecommendationResponse::from)
                .toList();

        List<PlacementTargetResponse> placementTargets = placementTargetRepository
                .findByProfileUserIdAndCompanyNameContainingIgnoreCaseOrProfileUserIdAndRoleNameContainingIgnoreCase(userId, searchPattern, userId, searchPattern).stream()
                .map(PlacementTargetResponse::from)
                .toList();

        return new SearchResultGroup(skills, courses, domains, roadmaps, mentorRecommendations, placementTargets);
    }
}
