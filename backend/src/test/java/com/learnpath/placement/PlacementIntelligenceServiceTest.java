package com.learnpath.placement;

import com.learnpath.assessment.entity.AssessmentMetric;
import com.learnpath.assessment.entity.AssessmentResult;
import com.learnpath.assessment.entity.AssessmentTemplate;
import com.learnpath.assessment.repository.AssessmentMetricRepository;
import com.learnpath.assessment.repository.AssessmentResultRepository;
import com.learnpath.domain.entity.Domain;
import com.learnpath.placement.entity.*;
import com.learnpath.placement.repository.*;
import com.learnpath.placement.service.*;
import com.learnpath.skill.entity.Skill;
import com.learnpath.skill.repository.SkillRepository;
import com.learnpath.skill.repository.UserSkillRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Optional;
import java.util.UUID;

import static org.mockito.Mockito.*;

class PlacementIntelligenceServiceTest {

    @Mock private AssessmentResultRepository resultRepository;
    @Mock private AssessmentMetricRepository metricRepository;
    @Mock private PlacementProfileRepository profileRepository;
    @Mock private PlacementReadinessRepository readinessRepository;
    @Mock private PlacementInsightRepository insightRepository;
    @Mock private PlacementRecommendationRepository recommendationRepository;
    @Mock private CompanyFitScoreRepository companyFitScoreRepository;
    @Mock private SkillGapAnalysisRepository skillGapAnalysisRepository;
    @Mock private PlacementTargetRepository targetRepository;
    @Mock private SkillRepository skillRepository;
    @Mock private UserSkillRepository userSkillRepository;
    @Mock private PlacementInsightGenerator insightGenerator;
    @Mock private PlacementRecommendationGenerator recommendationGenerator;

    @InjectMocks
    private PlacementIntelligenceService service;

    private UUID userId;
    private UUID resultId;
    private Long domainId;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        userId = UUID.randomUUID();
        resultId = UUID.randomUUID();
        domainId = 1L;
    }

    @Test
    void processAssessmentCompletion_success() {
        AssessmentResult result = mock(AssessmentResult.class);
        AssessmentTemplate template = mock(AssessmentTemplate.class);
        Domain domain = mock(Domain.class);
        
        when(resultRepository.findById(resultId)).thenReturn(Optional.of(result));
        when(result.getTemplate()).thenReturn(template);
        when(template.getDomain()).thenReturn(domain);
        when(domain.getId()).thenReturn(domainId);

        PlacementProfile profile = mock(PlacementProfile.class);
        when(profileRepository.findByUserIdAndDomainId(userId, domainId)).thenReturn(Optional.of(profile));
        when(profile.getId()).thenReturn(UUID.randomUUID());

        AssessmentMetric metric = mock(AssessmentMetric.class);
        when(metricRepository.findByAssessmentResultId(resultId)).thenReturn(Optional.of(metric));
        when(metric.getOverallScore()).thenReturn(new BigDecimal("80.00"));

        when(readinessRepository.existsByAssessmentResultId(resultId)).thenReturn(false);
        when(targetRepository.findByProfileId(profile.getId())).thenReturn(new ArrayList<>());
        when(userSkillRepository.findByUserIdOrderBySkillNameAsc(userId)).thenReturn(new ArrayList<>());
        when(skillRepository.findByDomainIdOrderByNameAsc(domainId)).thenReturn(new ArrayList<>());

        when(insightGenerator.generateInsights(any(), any(), any(), any())).thenReturn(new ArrayList<>());
        when(recommendationGenerator.generateRecommendations(any(), any(), any(), any())).thenReturn(new ArrayList<>());

        service.processAssessmentCompletion(userId, resultId);

        verify(readinessRepository, times(1)).save(any(PlacementReadiness.class));
    }

    @Test
    void processAssessmentCompletion_alreadyProcessedReadinessSkipped() {
        AssessmentResult result = mock(AssessmentResult.class);
        AssessmentTemplate template = mock(AssessmentTemplate.class);
        Domain domain = mock(Domain.class);

        when(resultRepository.findById(resultId)).thenReturn(Optional.of(result));
        when(result.getTemplate()).thenReturn(template);
        when(template.getDomain()).thenReturn(domain);
        when(domain.getId()).thenReturn(domainId);

        PlacementProfile profile = mock(PlacementProfile.class);
        when(profileRepository.findByUserIdAndDomainId(userId, domainId)).thenReturn(Optional.of(profile));
        when(profile.getId()).thenReturn(UUID.randomUUID());

        AssessmentMetric metric = mock(AssessmentMetric.class);
        when(metricRepository.findByAssessmentResultId(resultId)).thenReturn(Optional.of(metric));

        when(readinessRepository.existsByAssessmentResultId(resultId)).thenReturn(true);
        when(targetRepository.findByProfileId(profile.getId())).thenReturn(new ArrayList<>());
        when(userSkillRepository.findByUserIdOrderBySkillNameAsc(userId)).thenReturn(new ArrayList<>());
        when(skillRepository.findByDomainIdOrderByNameAsc(domainId)).thenReturn(new ArrayList<>());

        when(insightGenerator.generateInsights(any(), any(), any(), any())).thenReturn(new ArrayList<>());
        when(recommendationGenerator.generateRecommendations(any(), any(), any(), any())).thenReturn(new ArrayList<>());

        service.processAssessmentCompletion(userId, resultId);

        verify(readinessRepository, never()).save(any(PlacementReadiness.class));
    }
}
