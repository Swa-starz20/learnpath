package com.learnpath.analytics.service;

import com.learnpath.analytics.entity.AnalyticsSnapshot;
import com.learnpath.analytics.entity.AnalyticsTrend;
import com.learnpath.analytics.repository.AnalyticsSnapshotRepository;
import com.learnpath.analytics.repository.AnalyticsTrendRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.when;

class AnalyticsTrendAnalyzerTest {

    private AnalyticsSnapshotRepository snapshotRepository;
    private AnalyticsTrendRepository trendRepository;
    private AnalyticsTrendAnalyzer trendAnalyzer;

    @BeforeEach
    void setUp() {
        snapshotRepository = Mockito.mock(AnalyticsSnapshotRepository.class);
        trendRepository = Mockito.mock(AnalyticsTrendRepository.class);
        trendAnalyzer = new AnalyticsTrendAnalyzer(snapshotRepository, trendRepository);

        when(trendRepository.saveAll(anyList())).thenAnswer(invocation -> invocation.getArgument(0));
    }

    @Test
    void analyzeTrends_noSnapshots_returnsEmpty() {
        UUID userId = UUID.randomUUID();
        when(snapshotRepository.findByUserIdOrderBySnapshotTimeDesc(userId)).thenReturn(List.of());

        List<AnalyticsTrend> trends = trendAnalyzer.analyzeTrends(userId);
        assertTrue(trends.isEmpty());
    }

    @Test
    void analyzeTrends_singleSnapshot_comparesToZero() {
        UUID userId = UUID.randomUUID();
        AnalyticsSnapshot latest = new AnalyticsSnapshot(
                userId,
                BigDecimal.valueOf(50.00),
                BigDecimal.valueOf(60.00),
                BigDecimal.valueOf(70.00),
                BigDecimal.valueOf(80.00),
                100,
                BigDecimal.valueOf(90.00)
        );

        when(snapshotRepository.findByUserIdOrderBySnapshotTimeDesc(userId)).thenReturn(List.of(latest));

        List<AnalyticsTrend> trends = trendAnalyzer.analyzeTrends(userId);
        assertEquals(5, trends.size());

        AnalyticsTrend roadmapTrend = findTrend(trends, "roadmap_completion");
        assertNotNull(roadmapTrend);
        assertEquals(BigDecimal.ZERO, roadmapTrend.getPreviousValue());
        assertEquals(BigDecimal.valueOf(60.00), roadmapTrend.getCurrentValue());
        assertEquals("UP", roadmapTrend.getTrendDirection());
        assertEquals(new BigDecimal("100.00"), roadmapTrend.getImprovementPercent());
    }

    @Test
    void analyzeTrends_twoSnapshots_calculatesCorrectDeltas() {
        UUID userId = UUID.randomUUID();
        AnalyticsSnapshot latest = new AnalyticsSnapshot(
                userId,
                BigDecimal.valueOf(55.00),
                BigDecimal.valueOf(70.00),
                BigDecimal.valueOf(75.00),
                BigDecimal.valueOf(85.00),
                150,
                BigDecimal.valueOf(95.00)
        );
        AnalyticsSnapshot previous = new AnalyticsSnapshot(
                userId,
                BigDecimal.valueOf(50.00),
                BigDecimal.valueOf(60.00),
                BigDecimal.valueOf(70.00),
                BigDecimal.valueOf(80.00),
                100,
                BigDecimal.valueOf(90.00)
        );

        when(snapshotRepository.findByUserIdOrderBySnapshotTimeDesc(userId)).thenReturn(List.of(latest, previous));

        List<AnalyticsTrend> trends = trendAnalyzer.analyzeTrends(userId);
        assertEquals(5, trends.size());

        // Test Roadmap Completion Trend (60.0 -> 70.0: UP +16.67%)
        AnalyticsTrend roadmapTrend = findTrend(trends, "roadmap_completion");
        assertNotNull(roadmapTrend);
        assertEquals(BigDecimal.valueOf(60.00), roadmapTrend.getPreviousValue());
        assertEquals(BigDecimal.valueOf(70.00), roadmapTrend.getCurrentValue());
        assertEquals("UP", roadmapTrend.getTrendDirection());
        assertEquals(new BigDecimal("16.67"), roadmapTrend.getImprovementPercent());

        // Test Total XP Trend (100 -> 150: UP +50.00%)
        AnalyticsTrend xpTrend = findTrend(trends, "total_xp");
        assertNotNull(xpTrend);
        assertEquals(BigDecimal.valueOf(100), xpTrend.getPreviousValue());
        assertEquals(BigDecimal.valueOf(150), xpTrend.getCurrentValue());
        assertEquals("UP", xpTrend.getTrendDirection());
        assertEquals(new BigDecimal("50.00"), xpTrend.getImprovementPercent());
    }

    private AnalyticsTrend findTrend(List<AnalyticsTrend> trends, String metricName) {
        return trends.stream()
                .filter(t -> t.getMetricName().equals(metricName))
                .findFirst()
                .orElse(null);
    }
}
