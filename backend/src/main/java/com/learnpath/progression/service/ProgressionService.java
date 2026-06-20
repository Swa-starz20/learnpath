package com.learnpath.progression.service;

import com.learnpath.progression.dto.AddXpRequest;
import com.learnpath.progression.dto.ProgressionResponse;
import com.learnpath.progression.entity.UserProgression;
import com.learnpath.progression.repository.UserProgressionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

/**
 * Single source of truth for XP tracking, mastery score, and progression.
 *
 * <p>Creates a progression record lazily on first access.
 */
@Service
public class ProgressionService {

    private static final Logger log = LoggerFactory.getLogger(ProgressionService.class);

    private final UserProgressionRepository progressionRepository;

    public ProgressionService(UserProgressionRepository progressionRepository) {
        this.progressionRepository = progressionRepository;
    }

    /**
     * Returns the current user's progression record, creating it if it does not exist.
     */
    @Transactional
    public ProgressionResponse getOrCreateProgression(UUID userId) {
        UserProgression progression = progressionRepository.findByUserId(userId)
                .orElseGet(() -> {
                    log.info("Creating new progression record for user: {}", userId);
                    return progressionRepository.save(UserProgression.createForUser(userId));
                });
        return ProgressionResponse.from(progression);
    }

    /**
     * Adds XP to a user's progression record.
     *
     * @return updated progression response
     */
    @Transactional
    public ProgressionResponse addXp(UUID userId, AddXpRequest request) {
        UserProgression progression = progressionRepository.findByUserId(userId)
                .orElseGet(() -> {
                    log.info("Creating progression record for user on first XP grant: {}", userId);
                    return UserProgression.createForUser(userId);
                });
        progression.addXp(request.amount());
        log.info("Added {} XP to user {} (reason: {}). Total: {}",
                request.amount(), userId, request.reason(), progression.getTotalXp());
        return ProgressionResponse.from(progressionRepository.save(progression));
    }
}
