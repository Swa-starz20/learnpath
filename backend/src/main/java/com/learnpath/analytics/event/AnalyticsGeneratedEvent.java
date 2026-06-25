package com.learnpath.analytics.event;

import java.time.Instant;
import java.util.UUID;

public record AnalyticsGeneratedEvent(
        UUID userId,
        UUID snapshotId,
        Instant generatedAt
) {}
