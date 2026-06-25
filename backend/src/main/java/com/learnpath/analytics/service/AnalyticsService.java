package com.learnpath.analytics.service;

import com.learnpath.analytics.dto.ActivityLogResponse;
import com.learnpath.analytics.dto.AnalyticsSnapshotResponse;
import com.learnpath.analytics.dto.LearningStreakResponse;
import com.learnpath.analytics.entity.ActivityLog;
import com.learnpath.analytics.entity.AnalyticsSnapshot;
import com.learnpath.analytics.entity.LearningStreak;
import com.learnpath.analytics.repository.ActivityLogRepository;
import com.learnpath.analytics.repository.AnalyticsSnapshotRepository;
import com.learnpath.analytics.repository.LearningStreakRepository;
import com.learnpath.analytics.dto.AnalyticsInsightResponse;
import com.learnpath.analytics.dto.AnalyticsPredictionResponse;
import com.learnpath.analytics.dto.AnalyticsRecommendationResponse;
import com.learnpath.analytics.dto.AnalyticsTrendResponse;
import com.learnpath.analytics.repository.AnalyticsInsightRepository;
import com.learnpath.analytics.repository.AnalyticsPredictionRepository;
import com.learnpath.analytics.repository.AnalyticsRecommendationRepository;
import com.learnpath.analytics.repository.AnalyticsTrendRepository;
import com.learnpath.assessment.entity.AssessmentResult;
import com.learnpath.assessment.repository.AssessmentResultRepository;
import com.learnpath.placement.entity.PlacementProfile;
import com.learnpath.placement.entity.PlacementReadiness;
import com.learnpath.placement.repository.PlacementProfileRepository;
import com.learnpath.placement.repository.PlacementReadinessRepository;
import com.learnpath.progression.dto.ProgressionResponse;
import com.learnpath.progression.service.ProgressionService;
import com.learnpath.roadmap.entity.CareerTrack;
import com.learnpath.roadmap.entity.UserRoadmapProgress;
import com.learnpath.roadmap.repository.CareerTrackRepository;
import com.learnpath.roadmap.repository.RoadmapNodeRepository;
import com.learnpath.roadmap.repository.UserRoadmapProgressRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class AnalyticsService {

    private static final Logger log = LoggerFactory.getLogger(AnalyticsService.class);

    private final AnalyticsSnapshotRepository analyticsSnapshotRepository;
    private final ActivityLogRepository activityLogRepository;
    private final LearningStreakRepository learningStreakRepository;
    private final ProgressionService progressionService;
    private final AssessmentResultRepository assessmentResultRepository;
    private final PlacementProfileRepository placementProfileRepository;
    private final PlacementReadinessRepository readinessRepository;
    private final UserRoadmapProgressRepository userRoadmapProgressRepository;
    private final RoadmapNodeRepository roadmapNodeRepository;
    private final CareerTrackRepository careerTrackRepository;
    private final AnalyticsInsightRepository insightRepository;
    private final AnalyticsRecommendationRepository recommendationRepository;
    private final AnalyticsTrendRepository trendRepository;
    private final AnalyticsPredictionRepository predictionRepository;

    public AnalyticsService(
            AnalyticsSnapshotRepository analyticsSnapshotRepository,
            ActivityLogRepository activityLogRepository,
            LearningStreakRepository learningStreakRepository,
            ProgressionService progressionService,
            AssessmentResultRepository assessmentResultRepository,
            PlacementProfileRepository placementProfileRepository,
            PlacementReadinessRepository readinessRepository,
            UserRoadmapProgressRepository userRoadmapProgressRepository,
            RoadmapNodeRepository roadmapNodeRepository,
            CareerTrackRepository careerTrackRepository,
            AnalyticsInsightRepository insightRepository,
            AnalyticsRecommendationRepository recommendationRepository,
            AnalyticsTrendRepository trendRepository,
            AnalyticsPredictionRepository predictionRepository) {
        this.analyticsSnapshotRepository = analyticsSnapshotRepository;
        this.activityLogRepository = activityLogRepository;
        this.learningStreakRepository = learningStreakRepository;
        this.progressionService = progressionService;
        this.assessmentResultRepository = assessmentResultRepository;
        this.placementProfileRepository = placementProfileRepository;
        this.readinessRepository = readinessRepository;
        this.userRoadmapProgressRepository = userRoadmapProgressRepository;
        this.roadmapNodeRepository = roadmapNodeRepository;
        this.careerTrackRepository = careerTrackRepository;
        this.insightRepository = insightRepository;
        this.recommendationRepository = recommendationRepository;
        this.trendRepository = trendRepository;
        this.predictionRepository = predictionRepository;
    }

    @Transactional
    public AnalyticsSnapshotResponse calculateAndSaveSnapshot(UUID userId) {
        // 1. Roadmap Completion
        BigDecimal roadmapCompletion = BigDecimal.ZERO;
        List<CareerTrack> relevantTracks = new ArrayList<>();

        // Try to get tracks from PlacementProfile
        List<PlacementProfile> profiles = placementProfileRepository.findByUserId(userId);
        if (!profiles.isEmpty()) {
            for (PlacementProfile profile : profiles) {
                if (profile.getDomainId() != null) {
                    relevantTracks.addAll(careerTrackRepository.findByDomainIdAndActiveTrueOrderByNameAsc(profile.getDomainId()));
                }
            }
        }

        // Fallback to tracks with progress
        if (relevantTracks.isEmpty()) {
            List<UserRoadmapProgress> progressList = userRoadmapProgressRepository.findByUserId(userId);
            List<CareerTrack> progressTracks = progressList.stream()
                    .map(UserRoadmapProgress::getCareerTrack)
                    .distinct()
                    .toList();
            relevantTracks.addAll(progressTracks);
        }

        if (!relevantTracks.isEmpty()) {
            double totalCompletionSum = 0.0;
            int trackCount = 0;
            for (CareerTrack track : relevantTracks) {
                long completedNodesCount = userRoadmapProgressRepository.countByUserIdAndCareerTrackIdAndStatus(userId, track.getId(), "COMPLETED");
                long totalNodesCount = roadmapNodeRepository.findByCareerTrackIdOrderByOrderIndexAsc(track.getId()).size();
                if (totalNodesCount > 0) {
                    totalCompletionSum += (double) completedNodesCount / totalNodesCount;
                    trackCount++;
                }
            }
            if (trackCount > 0) {
                double averageCompletion = (totalCompletionSum / trackCount) * 100.0;
                roadmapCompletion = BigDecimal.valueOf(averageCompletion).setScale(2, java.math.RoundingMode.HALF_UP);
            }
        }

        // 2. Assessment Average
        List<AssessmentResult> results = assessmentResultRepository.findByUserIdOrderByCompletedAtDesc(userId);
        BigDecimal assessmentAverage = BigDecimal.ZERO;
        if (!results.isEmpty()) {
            BigDecimal sum = BigDecimal.ZERO;
            for (AssessmentResult res : results) {
                sum = sum.add(res.getScorePercentage());
            }
            assessmentAverage = sum.divide(BigDecimal.valueOf(results.size()), 2, java.math.RoundingMode.HALF_UP);
        }

        // 3. Readiness Score
        BigDecimal readinessScore = BigDecimal.ZERO;
        if (!profiles.isEmpty()) {
            BigDecimal latestScore = BigDecimal.ZERO;
            Instant latestTime = Instant.MIN;
            for (PlacementProfile profile : profiles) {
                Optional<PlacementReadiness> readinessOpt = readinessRepository.findFirstByProfileIdOrderByCreatedAtDesc(profile.getId());
                if (readinessOpt.isPresent()) {
                    PlacementReadiness r = readinessOpt.get();
                    if (r.getCreatedAt().isAfter(latestTime)) {
                        latestTime = r.getCreatedAt();
                        latestScore = r.getReadinessScore();
                    }
                }
            }
            readinessScore = latestScore;
        }

        // 4. XP and Mastery Score from Progression Service
        ProgressionResponse progression = progressionService.getOrCreateProgression(userId);
        Integer totalXp = progression.totalXp();
        BigDecimal masteryScore = progression.masteryScore();

        // 5. Overall Progress (Mean of roadmap completion and assessment average)
        BigDecimal overallProgress = roadmapCompletion.add(assessmentAverage)
                .divide(BigDecimal.valueOf(2), 2, java.math.RoundingMode.HALF_UP);

        AnalyticsSnapshot snapshot = new AnalyticsSnapshot(
                userId,
                overallProgress,
                roadmapCompletion,
                assessmentAverage,
                readinessScore,
                totalXp,
                masteryScore
        );
        snapshot = analyticsSnapshotRepository.save(snapshot);
        return AnalyticsSnapshotResponse.from(snapshot);
    }

    @Transactional
    public AnalyticsSnapshotResponse getLatestSummary(UUID userId) {
        AnalyticsSnapshot snapshot = analyticsSnapshotRepository.findFirstByUserIdOrderBySnapshotTimeDesc(userId)
                .orElseGet(() -> saveDefaultSnapshot(userId));
        return AnalyticsSnapshotResponse.from(snapshot);
    }

    @Transactional
    public AnalyticsSnapshotResponse calculateAndSaveSnapshotOnDemand(UUID userId) {
        return calculateAndSaveSnapshot(userId);
    }

    private AnalyticsSnapshot saveDefaultSnapshot(UUID userId) {
        calculateAndSaveSnapshot(userId);
        return analyticsSnapshotRepository.findFirstByUserIdOrderBySnapshotTimeDesc(userId)
                .orElseThrow(() -> new IllegalStateException("Snapshot calculation failed"));
    }

    @Transactional
    public ActivityLogResponse appendActivityLog(UUID userId, String activityType, String referenceId, Map<String, Object> metadata) {
        ActivityLog logEntry = new ActivityLog(userId, activityType, referenceId, metadata);
        logEntry = activityLogRepository.save(logEntry);

        LocalDate todayUtc = LocalDate.now(ZoneOffset.UTC);
        updateStreak(userId, todayUtc);

        return ActivityLogResponse.from(logEntry);
    }

    @Transactional(readOnly = true)
    public List<ActivityLogResponse> getActivityHistory(UUID userId) {
        return activityLogRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(ActivityLogResponse::from)
                .toList();
    }

    @Transactional
    public LearningStreakResponse getStreak(UUID userId) {
        LearningStreak streak = learningStreakRepository.findByUserId(userId)
                .orElseGet(() -> {
                    LocalDate twoDaysAgoUtc = LocalDate.now(ZoneOffset.UTC).minusDays(2);
                    LearningStreak defaultStreak = new LearningStreak(userId, 0, 0, twoDaysAgoUtc);
                    return learningStreakRepository.save(defaultStreak);
                });
        return LearningStreakResponse.from(streak);
    }

    @Transactional
    public LearningStreakResponse updateStreak(UUID userId, LocalDate activityDate) {
        LearningStreak streak = learningStreakRepository.findByUserId(userId)
                .orElseGet(() -> new LearningStreak(userId, 0, 0, activityDate.minusDays(2)));

        LocalDate lastDate = streak.getLastActivityDate();
        if (activityDate.isAfter(lastDate)) {
            if (activityDate.minusDays(1).equals(lastDate)) {
                streak.setCurrentStreak(streak.getCurrentStreak() + 1);
            } else if (activityDate.equals(lastDate)) {
                // keep current
            } else {
                streak.setCurrentStreak(1);
            }

            if (streak.getCurrentStreak() > streak.getLongestStreak()) {
                streak.setLongestStreak(streak.getCurrentStreak());
            }
            streak.setLastActivityDate(activityDate);
            streak = learningStreakRepository.save(streak);
        }
        return LearningStreakResponse.from(streak);
    }

    @Transactional(readOnly = true)
    public List<AnalyticsInsightResponse> getInsights(UUID userId) {
        return insightRepository.findByUserIdOrderByGeneratedAtDesc(userId).stream()
                .map(AnalyticsInsightResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<AnalyticsRecommendationResponse> getRecommendations(UUID userId) {
        return recommendationRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(AnalyticsRecommendationResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<AnalyticsTrendResponse> getTrends(UUID userId) {
        return trendRepository.findByUserIdOrderByCalculatedAtDesc(userId).stream()
                .map(AnalyticsTrendResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<AnalyticsPredictionResponse> getPredictions(UUID userId) {
        return predictionRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(AnalyticsPredictionResponse::from)
                .toList();
    }

    @Transactional
    public void cleanupSnapshots() {
        log.info("Running monthly analytics snapshot cleanup for snapshots older than 90 days");
        Instant threshold = Instant.now().minus(90, java.time.temporal.ChronoUnit.DAYS);
        analyticsSnapshotRepository.deleteBySnapshotTimeBefore(threshold);
    }
}
