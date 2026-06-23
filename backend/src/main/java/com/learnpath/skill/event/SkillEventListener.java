package com.learnpath.skill.event;

import com.learnpath.assessment.event.AssessmentCompletedEvent;
import com.learnpath.assessment.event.AssessmentCompletedEvent.AnswerSummary;
import com.learnpath.skill.entity.Skill;
import com.learnpath.skill.entity.UserSkill;
import com.learnpath.skill.repository.SkillRepository;
import com.learnpath.skill.repository.UserSkillRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import java.math.BigDecimal;
import java.time.Instant;

import org.springframework.core.annotation.Order;

/**
 * Event listener that processes skill updates after an assessment completed event.
 * Runs in a separate, isolated transaction only after the assessment transaction has committed.
 */
@Component
public class SkillEventListener {

    private static final Logger log = LoggerFactory.getLogger(SkillEventListener.class);

    private final UserSkillRepository userSkillRepository;
    private final SkillRepository skillRepository;

    public SkillEventListener(UserSkillRepository userSkillRepository, SkillRepository skillRepository) {
        this.userSkillRepository = userSkillRepository;
        this.skillRepository = skillRepository;
    }

    @Order(1)
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void onAssessmentCompleted(AssessmentCompletedEvent event) {
        log.info("Processing skill updates for user {} from assessment result {}", event.userId(), event.resultId());

        for (AnswerSummary ans : event.answers()) {
            if (ans.skillId() == null) {
                continue;
            }

            Long skillId = ans.skillId();
            Skill skill = skillRepository.findById(skillId).orElse(null);
            if (skill == null) {
                log.warn("Skill not found with ID {} during event processing", skillId);
                continue;
            }

            UserSkill userSkill = userSkillRepository.findByUserIdAndSkillId(event.userId(), skillId)
                    .orElse(null);

            if (userSkill != null) {
                if (ans.correct()) {
                    BigDecimal oldScore = userSkill.getConfidenceScore();
                    BigDecimal newScore = oldScore.add(BigDecimal.valueOf(15.00));
                    if (newScore.compareTo(BigDecimal.valueOf(100.00)) > 0) {
                        newScore = BigDecimal.valueOf(100.00);
                    }
                    userSkill.setConfidenceScore(newScore);
                    userSkill.setMasteryLevel(determineMasteryLevel(newScore));
                    userSkill.setLastAssessedAt(Instant.now());
                    userSkillRepository.save(userSkill);
                    log.debug("Increased skill {} confidence for user {} to {}", skillId, event.userId(), newScore);
                }
            } else {
                UserSkill newSkill = new UserSkill(event.userId(), skill);
                BigDecimal confidence = ans.correct() ? BigDecimal.valueOf(60.00) : BigDecimal.valueOf(30.00);
                newSkill.setConfidenceScore(confidence);
                newSkill.setMasteryLevel(determineMasteryLevel(confidence));
                newSkill.setLastAssessedAt(Instant.now());
                userSkillRepository.save(newSkill);
                log.debug("Initialized skill {} for user {} with confidence {}", skillId, event.userId(), confidence);
            }
        }
    }

    private String determineMasteryLevel(BigDecimal confidence) {
        if (confidence.compareTo(BigDecimal.valueOf(75.00)) >= 0) {
            return "ADVANCED";
        } else if (confidence.compareTo(BigDecimal.valueOf(40.00)) >= 0) {
            return "INTERMEDIATE";
        } else {
            return "BEGINNER";
        }
    }
}
