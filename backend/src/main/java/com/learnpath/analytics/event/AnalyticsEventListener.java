package com.learnpath.analytics.event;

import com.learnpath.assessment.event.AssessmentCompletedEvent;
import com.learnpath.analytics.service.AnalyticsIntelligenceService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
public class AnalyticsEventListener {

    private static final Logger log = LoggerFactory.getLogger(AnalyticsEventListener.class);

    private final AnalyticsIntelligenceService intelligenceService;

    public AnalyticsEventListener(AnalyticsIntelligenceService intelligenceService) {
        this.intelligenceService = intelligenceService;
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void onAssessmentCompleted(AssessmentCompletedEvent event) {
        log.info("Received AssessmentCompletedEvent in Analytics module for user: {}, resultId: {}", event.userId(), event.resultId());
        try {
            intelligenceService.processAnalyticsIntelligence(event.userId());
        } catch (Exception e) {
            log.error("Failed to process analytics intelligence for user: {}", event.userId(), e);
        }
    }
}
