package com.learnpath.placement.service;

import com.learnpath.assessment.event.AssessmentCompletedEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

/**
 * Event listener in the Placement module that listens for {@link AssessmentCompletedEvent}
 * and triggers placement intelligence processing after successful transaction commit.
 */
@Component
public class PlacementEventListener {

    private static final Logger log = LoggerFactory.getLogger(PlacementEventListener.class);

    private final PlacementIntelligenceService placementIntelligenceService;

    public PlacementEventListener(PlacementIntelligenceService placementIntelligenceService) {
        this.placementIntelligenceService = placementIntelligenceService;
    }

    /**
     * Responds to assessment completion after the main transaction has successfully committed.
     * Uses Propagation.REQUIRES_NEW to open a new transactional context for persistence.
     */
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void onAssessmentCompleted(AssessmentCompletedEvent event) {
        log.info("Received AssessmentCompletedEvent in Placement module for user: {}, resultId: {}", event.userId(), event.resultId());
        try {
            placementIntelligenceService.processAssessmentCompletion(event.userId(), event.resultId());
        } catch (Exception e) {
            log.error("Failed to process placement intelligence for user: {}, resultId: {}",
                    event.userId(), event.resultId(), e);
        }
    }
}
