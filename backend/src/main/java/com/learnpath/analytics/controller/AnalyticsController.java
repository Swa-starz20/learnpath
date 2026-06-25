package com.learnpath.analytics.controller;

import com.learnpath.analytics.dto.ActivityLogResponse;
import com.learnpath.analytics.dto.AnalyticsSnapshotResponse;
import com.learnpath.analytics.dto.LearningStreakResponse;
import com.learnpath.analytics.dto.AnalyticsInsightResponse;
import com.learnpath.analytics.dto.AnalyticsRecommendationResponse;
import com.learnpath.analytics.dto.AnalyticsTrendResponse;
import com.learnpath.analytics.dto.AnalyticsPredictionResponse;
import com.learnpath.analytics.service.AnalyticsService;
import com.learnpath.common.response.ApiResponse;
import com.learnpath.security.UserPrincipal;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<AnalyticsSnapshotResponse>> getSummary(@AuthenticationPrincipal UserPrincipal principal) {
        AnalyticsSnapshotResponse summary = analyticsService.getLatestSummary(principal.getId());
        return ResponseEntity.ok(ApiResponse.ok(summary));
    }

    @GetMapping("/activity")
    public ResponseEntity<ApiResponse<List<ActivityLogResponse>>> getActivity(@AuthenticationPrincipal UserPrincipal principal) {
        List<ActivityLogResponse> activityHistory = analyticsService.getActivityHistory(principal.getId());
        return ResponseEntity.ok(ApiResponse.ok(activityHistory));
    }

    @GetMapping("/streak")
    public ResponseEntity<ApiResponse<LearningStreakResponse>> getStreak(@AuthenticationPrincipal UserPrincipal principal) {
        LearningStreakResponse streak = analyticsService.getStreak(principal.getId());
        return ResponseEntity.ok(ApiResponse.ok(streak));
    }

    @PostMapping("/snapshot")
    public ResponseEntity<ApiResponse<AnalyticsSnapshotResponse>> createSnapshot(@AuthenticationPrincipal UserPrincipal principal) {
        AnalyticsSnapshotResponse snapshot = analyticsService.calculateAndSaveSnapshotOnDemand(principal.getId());
        return ResponseEntity.ok(ApiResponse.ok(snapshot));
    }

    @GetMapping("/insights")
    public ResponseEntity<ApiResponse<List<AnalyticsInsightResponse>>> getInsights(@AuthenticationPrincipal UserPrincipal principal) {
        List<AnalyticsInsightResponse> insights = analyticsService.getInsights(principal.getId());
        return ResponseEntity.ok(ApiResponse.ok(insights));
    }

    @GetMapping("/recommendations")
    public ResponseEntity<ApiResponse<List<AnalyticsRecommendationResponse>>> getRecommendations(@AuthenticationPrincipal UserPrincipal principal) {
        List<AnalyticsRecommendationResponse> recommendations = analyticsService.getRecommendations(principal.getId());
        return ResponseEntity.ok(ApiResponse.ok(recommendations));
    }

    @GetMapping("/trends")
    public ResponseEntity<ApiResponse<List<AnalyticsTrendResponse>>> getTrends(@AuthenticationPrincipal UserPrincipal principal) {
        List<AnalyticsTrendResponse> trends = analyticsService.getTrends(principal.getId());
        return ResponseEntity.ok(ApiResponse.ok(trends));
    }

    @GetMapping("/predictions")
    public ResponseEntity<ApiResponse<List<AnalyticsPredictionResponse>>> getPredictions(@AuthenticationPrincipal UserPrincipal principal) {
        List<AnalyticsPredictionResponse> predictions = analyticsService.getPredictions(principal.getId());
        return ResponseEntity.ok(ApiResponse.ok(predictions));
    }
}
