package com.learnpath.mentor.service;

import com.learnpath.exception.DuplicateResourceException;
import com.learnpath.exception.ResourceNotFoundException;
import com.learnpath.mentor.dto.*;
import com.learnpath.mentor.entity.*;
import com.learnpath.mentor.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Service for the Mentor module handling data access and persistence.
 *
 * <p>Does not contain AI, recommendation engines, or intelligence generation logic.
 */
@Service
public class MentorService {

    private static final Logger log = LoggerFactory.getLogger(MentorService.class);

    private final MentorProfileRepository profileRepository;
    private final MentorInsightRepository insightRepository;
    private final MentorRecommendationRepository recommendationRepository;

    public MentorService(
            MentorProfileRepository profileRepository,
            MentorInsightRepository insightRepository,
            MentorRecommendationRepository recommendationRepository) {
        this.profileRepository = profileRepository;
        this.insightRepository = insightRepository;
        this.recommendationRepository = recommendationRepository;
    }

    /**
     * Retrieves the mentor profile for the given user ID.
     */
    @Transactional(readOnly = true)
    public MentorProfileResponse getProfile(UUID userId) {
        MentorProfile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("MentorProfile", "userId", userId));
        return MentorProfileResponse.from(profile);
    }

    /**
     * Creates a mentor profile for the given user ID.
     */
    @Transactional
    public MentorProfileResponse createProfile(UUID userId, UpdateMentorProfileRequest request) {
        if (profileRepository.existsByUserId(userId)) {
            throw new DuplicateResourceException("Mentor profile already exists for user: " + userId);
        }

        MentorProfile profile = new MentorProfile(
                userId,
                request.primaryDomainId(),
                request.currentLevel(),
                request.targetRole()
        );
        MentorProfile saved = profileRepository.save(profile);
        log.info("Created mentor profile for user: {}", userId);
        return MentorProfileResponse.from(saved);
    }

    /**
     * Updates an existing mentor profile for the given user ID.
     */
    @Transactional
    public MentorProfileResponse updateProfile(UUID userId, UpdateMentorProfileRequest request) {
        MentorProfile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("MentorProfile", "userId", userId));

        profile.setPrimaryDomainId(request.primaryDomainId());
        profile.setCurrentLevel(request.currentLevel());
        profile.setTargetRole(request.targetRole());

        MentorProfile saved = profileRepository.save(profile);
        log.info("Updated mentor profile for user: {}", userId);
        return MentorProfileResponse.from(saved);
    }

    /**
     * Lists active mentor insights for the given user.
     */
    @Transactional(readOnly = true)
    public List<MentorInsightResponse> listInsights(UUID userId) {
        return insightRepository.findByUserIdOrderByGeneratedAtDesc(userId)
                .stream()
                .map(MentorInsightResponse::from)
                .collect(Collectors.toList());
    }

    /**
     * Lists active mentor recommendations for the given user.
     */
    @Transactional(readOnly = true)
    public List<MentorRecommendationResponse> listRecommendations(UUID userId) {
        return recommendationRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(MentorRecommendationResponse::from)
                .collect(Collectors.toList());
    }
}
