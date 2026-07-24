package com.learnpath.mentor.event;

import com.learnpath.assessment.event.AssessmentCompletedEvent;
import com.learnpath.mentor.service.MentorIntelligenceService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

/**
 * Event listener in the Mentor module that listens for {@link AssessmentCompletedEvent}
 * and triggers mentor intelligence processing after successful transaction commit.
 */
@Component
public class MentorEventListener {

    private static final Logger log = LoggerFactory.getLogger(MentorEventListener.class);

    private final MentorIntelligenceService mentorIntelligenceService;

    public MentorEventListener(MentorIntelligenceService mentorIntelligenceService) {
        this.mentorIntelligenceService = mentorIntelligenceService;
    }

    /**
     * Responds to assessment completion after the main transaction has successfully committed.
     * Uses Propagation.REQUIRES_NEW to open a new transactional context for persistence.
     */
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void onAssessmentCompleted(AssessmentCompletedEvent event) {
        log.info("Received AssessmentCompletedEvent in Mentor module for user: {}, resultId: {}", event.userId(), event.resultId());
        try {
            mentorIntelligenceService.processAssessmentCompletion(event.userId(), event.resultId());
        } catch (Exception e) {
            log.error("Failed to process mentor intelligence for user: {}, resultId: {}",
                    event.userId(), event.resultId(), e);
        }
    }
}
