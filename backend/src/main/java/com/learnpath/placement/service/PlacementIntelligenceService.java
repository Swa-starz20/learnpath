package com.learnpath.placement.service;

import com.learnpath.assessment.entity.AssessmentMetric;
import com.learnpath.assessment.entity.AssessmentResult;
import com.learnpath.assessment.repository.AssessmentMetricRepository;
import com.learnpath.assessment.repository.AssessmentResultRepository;
import com.learnpath.placement.entity.*;
import com.learnpath.placement.repository.*;
import com.learnpath.skill.entity.Skill;
import com.learnpath.skill.entity.UserSkill;
import com.learnpath.skill.repository.SkillRepository;
import com.learnpath.skill.repository.UserSkillRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
public class PlacementIntelligenceService {

    private static final Logger log = LoggerFactory.getLogger(PlacementIntelligenceService.class);

    private final AssessmentResultRepository resultRepository;
    private final AssessmentMetricRepository metricRepository;
    private final PlacementProfileRepository profileRepository;
    private final PlacementReadinessRepository readinessRepository;
    private final PlacementInsightRepository insightRepository;
    private final PlacementRecommendationRepository recommendationRepository;
    private final CompanyFitScoreRepository companyFitScoreRepository;
    private final SkillGapAnalysisRepository skillGapAnalysisRepository;
    private final PlacementTargetRepository targetRepository;
    private final SkillRepository skillRepository;
    private final UserSkillRepository userSkillRepository;
    private final PlacementInsightGenerator insightGenerator;
    private final PlacementRecommendationGenerator recommendationGenerator;

    public PlacementIntelligenceService(
            AssessmentResultRepository resultRepository,
            AssessmentMetricRepository metricRepository,
            PlacementProfileRepository profileRepository,
            PlacementReadinessRepository readinessRepository,
            PlacementInsightRepository insightRepository,
            PlacementRecommendationRepository recommendationRepository,
            CompanyFitScoreRepository companyFitScoreRepository,
            SkillGapAnalysisRepository skillGapAnalysisRepository,
            PlacementTargetRepository targetRepository,
            SkillRepository skillRepository,
            UserSkillRepository userSkillRepository,
            PlacementInsightGenerator insightGenerator,
            PlacementRecommendationGenerator recommendationGenerator) {
        this.resultRepository = resultRepository;
        this.metricRepository = metricRepository;
        this.profileRepository = profileRepository;
        this.readinessRepository = readinessRepository;
        this.insightRepository = insightRepository;
        this.recommendationRepository = recommendationRepository;
        this.companyFitScoreRepository = companyFitScoreRepository;
        this.skillGapAnalysisRepository = skillGapAnalysisRepository;
        this.targetRepository = targetRepository;
        this.skillRepository = skillRepository;
        this.userSkillRepository = userSkillRepository;
        this.insightGenerator = insightGenerator;
        this.recommendationGenerator = recommendationGenerator;
    }

    /**
     * Processes assessment completion.
     * Computes readiness, fit scores, skill gaps, insights, and recommendations.
     */
    @Transactional
    public void processAssessmentCompletion(UUID userId, UUID resultId) {
        log.info("Starting placement intelligence processing for user: {}, result: {}", userId, resultId);

        AssessmentResult result = resultRepository.findById(resultId).orElse(null);
        if (result == null) {
            log.warn("No assessment result found for result ID: {}. Skipping placement intelligence.", resultId);
            return;
        }

        Long domainId = result.getTemplate().getDomain().getId();

        PlacementProfile profile = profileRepository.findByUserIdAndDomainId(userId, domainId).orElse(null);
        if (profile == null) {
            log.warn("No placement profile found for user: {} and domain: {}. Skipping placement intelligence.", userId, domainId);
            return;
        }

        AssessmentMetric metric = metricRepository.findByAssessmentResultId(resultId).orElse(null);
        if (metric == null) {
            log.warn("No assessment metrics found for result ID: {}. Skipping placement intelligence.", resultId);
            return;
        }

        // 1. Save Placement Readiness Score
        if (!readinessRepository.existsByAssessmentResultId(resultId)) {
            PlacementReadiness readiness = new PlacementReadiness(profile, resultId);
            readiness.setReadinessScore(metric.getOverallScore() != null ? metric.getOverallScore() : BigDecimal.ZERO);
            readiness.setTechnicalScore(metric.getTechnicalScore() != null ? metric.getTechnicalScore() : BigDecimal.ZERO);
            readiness.setAptitudeScore(metric.getAptitudeScore() != null ? metric.getAptitudeScore() : BigDecimal.ZERO);
            readiness.setCommunicationScore(metric.getCommunicationScore() != null ? metric.getCommunicationScore() : BigDecimal.ZERO);
            readiness.setBehavioralScore(metric.getBehavioralScore() != null ? metric.getBehavioralScore() : BigDecimal.ZERO);
            readinessRepository.save(readiness);
            log.debug("Persisted placement readiness for result ID: {}", resultId);
        }

        // 2. Generate Company Fit Scores
        List<PlacementTarget> targets = targetRepository.findByProfileId(profile.getId());
        List<UserSkill> userSkills = userSkillRepository.findByUserIdOrderBySkillNameAsc(userId);
        
        double totalConfidence = 0.0;
        int skillCount = 0;
        for (UserSkill us : userSkills) {
            if (us.getSkill().getDomain().getId().equals(domainId)) {
                totalConfidence += us.getConfidenceScore().doubleValue();
                skillCount++;
            }
        }
        double avgSkillConfidence = skillCount > 0 ? totalConfidence / skillCount : 0.0;
        double readinessScoreVal = metric.getOverallScore() != null ? metric.getOverallScore().doubleValue() : 0.0;
        double fitScoreVal = (readinessScoreVal * 0.6) + (avgSkillConfidence * 0.4);
        int finalFitScore = (int) Math.round(fitScoreVal);
        finalFitScore = Math.max(0, Math.min(100, finalFitScore));

        String confidenceLevel = "LOW";
        if (readinessScoreVal >= 75.0 && avgSkillConfidence >= 75.0) {
            confidenceLevel = "HIGH";
        } else if (readinessScoreVal >= 50.0 || avgSkillConfidence >= 50.0) {
            confidenceLevel = "MEDIUM";
        }

        for (PlacementTarget target : targets) {
            if (!companyFitScoreRepository.existsByAssessmentResultIdAndTargetCompanyAndTargetRole(resultId, target.getCompanyName(), target.getRoleName())) {
                CompanyFitScore fitScore = new CompanyFitScore(
                        profile,
                        resultId,
                        target.getCompanyName(),
                        target.getRoleName(),
                        finalFitScore,
                        confidenceLevel
                );
                companyFitScoreRepository.save(fitScore);
                log.debug("Persisted company fit score for target: {} - {}", target.getCompanyName(), target.getRoleName());
            }
        }

        // 3. Perform Skill Gap Analysis
        List<Skill> domainSkills = skillRepository.findByDomainIdOrderByNameAsc(domainId);
        for (Skill skill : domainSkills) {
            if (!skillGapAnalysisRepository.existsByAssessmentResultIdAndSkillId(resultId, skill.getId())) {
                BigDecimal confidence = userSkillRepository.findByUserIdAndSkillId(userId, skill.getId())
                        .map(UserSkill::getConfidenceScore)
                        .orElse(BigDecimal.ZERO);

                if (confidence.compareTo(new BigDecimal("75.00")) < 0) {
                    String gapType;
                    String severity;
                    String recommendedAction;
                    if (confidence.compareTo(new BigDecimal("40.00")) < 0) {
                        gapType = "CRITICAL";
                        severity = "HIGH";
                        recommendedAction = "Complete intensive training and practice in " + skill.getName();
                    } else {
                        gapType = "MODERATE";
                        severity = "MEDIUM";
                        recommendedAction = "Review concepts and practice exercises for " + skill.getName();
                    }

                    SkillGapAnalysis gap = new SkillGapAnalysis(
                            profile,
                            resultId,
                            skill.getId(),
                            skill.getName(),
                            gapType,
                            severity,
                            recommendedAction
                    );
                    skillGapAnalysisRepository.save(gap);
                    log.debug("Persisted skill gap for skill: {}", skill.getName());
                }
            }
        }

        // 4. Generate insights
        List<PlacementInsight> generatedInsights = insightGenerator.generateInsights(userId, profile, resultId, metric);
        for (PlacementInsight insight : generatedInsights) {
            boolean exists = insightRepository.existsByAssessmentResultIdAndCategoryAndInsightType(
                    resultId, insight.getCategory(), insight.getInsightType()
            );
            if (!exists) {
                insightRepository.save(insight);
                log.debug("Persisted placement insight: {} - {}", insight.getCategory(), insight.getInsightType());
            }
        }

        // 5. Generate recommendations
        List<PlacementRecommendation> generatedRecs = recommendationGenerator.generateRecommendations(userId, profile, resultId, generatedInsights);
        for (PlacementRecommendation rec : generatedRecs) {
            boolean existsActive = recommendationRepository.existsByProfileIdAndRecommendationTypeAndTitleAndActiveTrue(
                    profile.getId(), rec.getRecommendationType(), rec.getTitle()
            );
            if (!existsActive) {
                recommendationRepository.save(rec);
                log.debug("Persisted placement recommendation: {}", rec.getTitle());
            }
        }

        log.info("Completed placement intelligence processing for user: {}", userId);
    }
}
