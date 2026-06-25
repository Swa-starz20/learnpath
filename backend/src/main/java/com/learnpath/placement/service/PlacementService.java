package com.learnpath.placement.service;

import com.learnpath.exception.DuplicateResourceException;
import com.learnpath.exception.ResourceNotFoundException;
import com.learnpath.placement.dto.*;
import com.learnpath.placement.entity.*;
import com.learnpath.placement.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PlacementService {

    private static final Logger log = LoggerFactory.getLogger(PlacementService.class);

    private final PlacementProfileRepository profileRepository;
    private final PlacementTargetRepository targetRepository;
    private final PlacementPreferenceRepository preferenceRepository;
    private final PlacementReadinessRepository readinessRepository;
    private final PlacementInsightRepository insightRepository;
    private final PlacementRecommendationRepository recommendationRepository;
    private final CompanyFitScoreRepository companyFitScoreRepository;
    private final SkillGapAnalysisRepository skillGapAnalysisRepository;

    public PlacementService(
            PlacementProfileRepository profileRepository,
            PlacementTargetRepository targetRepository,
            PlacementPreferenceRepository preferenceRepository,
            PlacementReadinessRepository readinessRepository,
            PlacementInsightRepository insightRepository,
            PlacementRecommendationRepository recommendationRepository,
            CompanyFitScoreRepository companyFitScoreRepository,
            SkillGapAnalysisRepository skillGapAnalysisRepository) {
        this.profileRepository = profileRepository;
        this.targetRepository = targetRepository;
        this.preferenceRepository = preferenceRepository;
        this.readinessRepository = readinessRepository;
        this.insightRepository = insightRepository;
        this.recommendationRepository = recommendationRepository;
        this.companyFitScoreRepository = companyFitScoreRepository;
        this.skillGapAnalysisRepository = skillGapAnalysisRepository;
    }

    /**
     * Creates a placement profile for the given user ID and domain.
     */
    @Transactional
    public PlacementProfileResponse createProfile(UUID userId, CreatePlacementProfileRequest request) {
        if (profileRepository.existsByUserIdAndDomainId(userId, request.domainId())) {
            throw new DuplicateResourceException(
                    String.format("Placement profile already exists for user: %s and domain: %d", userId, request.domainId()));
        }

        PlacementProfile profile = new PlacementProfile(
                userId,
                request.domainId(),
                request.currentCgpa(),
                request.targetPackageLpa(),
                request.preferredLocation()
        );
        PlacementProfile savedProfile = profileRepository.save(profile);
        log.info("Created placement profile for user: {}, domain: {}", userId, request.domainId());

        // Initialize default preferences
        PlacementPreference preference = new PlacementPreference(savedProfile);
        preferenceRepository.save(preference);

        return PlacementProfileResponse.from(savedProfile);
    }

    /**
     * Updates an existing placement profile.
     */
    @Transactional
    public PlacementProfileResponse updateProfile(UUID userId, Long domainId, UpdatePlacementProfileRequest request) {
        PlacementProfile profile = profileRepository.findByUserIdAndDomainId(userId, domainId)
                .orElseThrow(() -> new ResourceNotFoundException("PlacementProfile", "domainId", domainId));

        profile.setCurrentCgpa(request.currentCgpa());
        profile.setTargetPackageLpa(request.targetPackageLpa());
        profile.setPreferredLocation(request.preferredLocation());

        PlacementProfile saved = profileRepository.save(profile);
        log.info("Updated placement profile for user: {}, domain: {}", userId, domainId);
        return PlacementProfileResponse.from(saved);
    }

    /**
     * Retrieves the placement profile for a given user and domain.
     */
    @Transactional(readOnly = true)
    public PlacementProfileResponse getProfile(UUID userId, Long domainId) {
        PlacementProfile profile = profileRepository.findByUserIdAndDomainId(userId, domainId)
                .orElseThrow(() -> new ResourceNotFoundException("PlacementProfile", "domainId", domainId));
        return PlacementProfileResponse.from(profile);
    }

    /**
     * Adds a placement target company/role.
     */
    @Transactional
    public PlacementTargetResponse addTarget(UUID userId, CreatePlacementTargetRequest request) {
        PlacementProfile profile = profileRepository.findByUserIdAndDomainId(userId, request.domainId())
                .orElseThrow(() -> new ResourceNotFoundException("PlacementProfile", "domainId", request.domainId()));

        PlacementTarget target = new PlacementTarget(
                profile,
                request.companyName(),
                request.roleName(),
                request.priority() != null ? request.priority() : 1
        );

        PlacementTarget saved = targetRepository.save(target);
        log.info("Added placement target for user profile: {}, company: {}", profile.getId(), request.companyName());
        return PlacementTargetResponse.from(saved);
    }

    /**
     * Lists all placement targets for a given user and domain.
     */
    @Transactional(readOnly = true)
    public List<PlacementTargetResponse> listTargets(UUID userId, Long domainId) {
        PlacementProfile profile = profileRepository.findByUserIdAndDomainId(userId, domainId)
                .orElseThrow(() -> new ResourceNotFoundException("PlacementProfile", "domainId", domainId));

        return targetRepository.findByProfileIdOrderByPriorityAsc(profile.getId())
                .stream()
                .map(PlacementTargetResponse::from)
                .collect(Collectors.toList());
    }

    /**
     * Updates placement preferences.
     */
    @Transactional
    public PlacementPreferenceResponse updatePreferences(UUID userId, UpdatePlacementPreferenceRequest request) {
        PlacementProfile profile = profileRepository.findByUserIdAndDomainId(userId, request.domainId())
                .orElseThrow(() -> new ResourceNotFoundException("PlacementProfile", "domainId", request.domainId()));

        PlacementPreference preference = preferenceRepository.findByProfileId(profile.getId())
                .orElseGet(() -> new PlacementPreference(profile));

        if (request.prefersRemote() != null) {
            preference.setPrefersRemote(request.prefersRemote());
        }
        if (request.prefersHybrid() != null) {
            preference.setPrefersHybrid(request.prefersHybrid());
        }
        if (request.prefersOnsite() != null) {
            preference.setPrefersOnsite(request.prefersOnsite());
        }
        if (request.preferredCompanySize() != null) {
            preference.setPreferredCompanySize(request.preferredCompanySize());
        }
        if (request.preferredIndustry() != null) {
            preference.setPreferredIndustry(request.preferredIndustry());
        }

        PlacementPreference saved = preferenceRepository.save(preference);
        log.info("Updated placement preferences for user profile: {}", profile.getId());
        return PlacementPreferenceResponse.from(saved);
    }

    /**
     * Retrieves placement preferences.
     */
    @Transactional(readOnly = true)
    public PlacementPreferenceResponse getPreferences(UUID userId, Long domainId) {
        PlacementProfile profile = profileRepository.findByUserIdAndDomainId(userId, domainId)
                .orElseThrow(() -> new ResourceNotFoundException("PlacementProfile", "domainId", domainId));

        PlacementPreference preference = preferenceRepository.findByProfileId(profile.getId())
                .orElseThrow(() -> new ResourceNotFoundException("PlacementPreference", "profileId", profile.getId()));

        return PlacementPreferenceResponse.from(preference);
    }

    /**
     * Retrieves the latest placement readiness score snapshot.
     */
    @Transactional(readOnly = true)
    public PlacementReadinessResponse getReadiness(UUID userId, Long domainId) {
        PlacementProfile profile = profileRepository.findByUserIdAndDomainId(userId, domainId)
                .orElseThrow(() -> new ResourceNotFoundException("PlacementProfile", "domainId", domainId));

        PlacementReadiness readiness = readinessRepository.findFirstByProfileIdOrderByCreatedAtDesc(profile.getId())
                .orElseThrow(() -> new ResourceNotFoundException("PlacementReadiness", "profileId", profile.getId()));

        return PlacementReadinessResponse.from(readiness);
    }

    /**
     * Lists all placement insights for the user and domain.
     */
    @Transactional(readOnly = true)
    public List<PlacementInsightResponse> listInsights(UUID userId, Long domainId) {
        PlacementProfile profile = profileRepository.findByUserIdAndDomainId(userId, domainId)
                .orElseThrow(() -> new ResourceNotFoundException("PlacementProfile", "domainId", domainId));

        return insightRepository.findByProfileId(profile.getId())
                .stream()
                .map(PlacementInsightResponse::from)
                .collect(Collectors.toList());
    }

    /**
     * Lists all placement recommendations for the user and domain.
     */
    @Transactional(readOnly = true)
    public List<PlacementRecommendationResponse> listRecommendations(UUID userId, Long domainId) {
        PlacementProfile profile = profileRepository.findByUserIdAndDomainId(userId, domainId)
                .orElseThrow(() -> new ResourceNotFoundException("PlacementProfile", "domainId", domainId));

        return recommendationRepository.findByProfileId(profile.getId())
                .stream()
                .map(PlacementRecommendationResponse::from)
                .collect(Collectors.toList());
    }

    /**
     * Lists all company fit scores for the user and domain.
     */
    @Transactional(readOnly = true)
    public List<CompanyFitScoreResponse> listFitScores(UUID userId, Long domainId) {
        PlacementProfile profile = profileRepository.findByUserIdAndDomainId(userId, domainId)
                .orElseThrow(() -> new ResourceNotFoundException("PlacementProfile", "domainId", domainId));

        return companyFitScoreRepository.findByProfileId(profile.getId())
                .stream()
                .map(CompanyFitScoreResponse::from)
                .collect(Collectors.toList());
    }

    /**
     * Lists all skill gaps for the user and domain.
     */
    @Transactional(readOnly = true)
    public List<SkillGapAnalysisResponse> listSkillGaps(UUID userId, Long domainId) {
        PlacementProfile profile = profileRepository.findByUserIdAndDomainId(userId, domainId)
                .orElseThrow(() -> new ResourceNotFoundException("PlacementProfile", "domainId", domainId));

        return skillGapAnalysisRepository.findByProfileId(profile.getId())
                .stream()
                .map(SkillGapAnalysisResponse::from)
                .collect(Collectors.toList());
    }
}
