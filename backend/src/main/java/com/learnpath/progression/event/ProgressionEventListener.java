package com.learnpath.progression.event;

import com.learnpath.assessment.event.AssessmentCompletedEvent;
import com.learnpath.progression.entity.UserProgression;
import com.learnpath.progression.repository.UserProgressionRepository;
import com.learnpath.skill.entity.UserSkill;
import com.learnpath.skill.repository.UserSkillRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.List;

import org.springframework.core.annotation.Order;

/**
 * Event listener that processes user progression updates (XP and mastery score)
 * after an assessment has successfully committed.
 */
@Component
public class ProgressionEventListener {

    private static final Logger log = LoggerFactory.getLogger(ProgressionEventListener.class);

    private final UserProgressionRepository progressionRepository;
    private final UserSkillRepository userSkillRepository;

    public ProgressionEventListener(
            UserProgressionRepository progressionRepository,
            UserSkillRepository userSkillRepository) {
        this.progressionRepository = progressionRepository;
        this.userSkillRepository = userSkillRepository;
    }

    @Order(2)
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void onAssessmentCompleted(AssessmentCompletedEvent event) {
        log.info("Processing progression updates for user {} from assessment score {}%", event.userId(), event.overallScore());

        UserProgression progression = progressionRepository.findByUserId(event.userId())
                .orElseGet(() -> {
                    log.info("Creating progression record for user {} on first assessment complete", event.userId());
                    return UserProgression.createForUser(event.userId());
                });

        // 1. Calculate and add XP (deterministic reward: 200 base XP + 3 XP per score percentage point)
        int xpGranted = 200 + event.overallScore().multiply(BigDecimal.valueOf(3)).intValue();
        progression.addXp(xpGranted);

        // 2. Calculate average confidence score of user skills
        List<UserSkill> userSkills = userSkillRepository.findByUserIdOrderBySkillNameAsc(event.userId());
        if (!userSkills.isEmpty()) {
            BigDecimal sum = BigDecimal.ZERO;
            for (UserSkill us : userSkills) {
                sum = sum.add(us.getConfidenceScore());
            }
            BigDecimal avg = sum.divide(BigDecimal.valueOf(userSkills.size()), 2, RoundingMode.HALF_UP);

            // Ensure no regression: only increase mastery score
            if (avg.compareTo(progression.getMasteryScore()) > 0) {
                log.info("Updating user {} mastery score from {} to {}", event.userId(), progression.getMasteryScore(), avg);
                progression.setMasteryScore(avg);
            } else {
                log.debug("User {} mastery score remains at {} (calculated average {} did not exceed current)",
                        event.userId(), progression.getMasteryScore(), avg);
            }
        }

        progression.setLastActivityAt(Instant.now());
        progressionRepository.save(progression);
        log.info("Progression updated for user {}. New XP: {}, Mastery Score: {}",
                event.userId(), progression.getTotalXp(), progression.getMasteryScore());
    }
}
