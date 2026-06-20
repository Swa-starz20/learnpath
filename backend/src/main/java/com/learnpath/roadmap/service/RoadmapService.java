package com.learnpath.roadmap.service;

import com.learnpath.exception.ResourceNotFoundException;
import com.learnpath.roadmap.dto.CareerTrackResponse;
import com.learnpath.roadmap.dto.RoadmapNodeResponse;
import com.learnpath.roadmap.dto.UpdateProgressRequest;
import com.learnpath.roadmap.dto.UserProgressResponse;
import com.learnpath.roadmap.entity.CareerTrack;
import com.learnpath.roadmap.entity.RoadmapNode;
import com.learnpath.roadmap.entity.UserRoadmapProgress;
import com.learnpath.roadmap.repository.CareerTrackRepository;
import com.learnpath.roadmap.repository.RoadmapNodeRepository;
import com.learnpath.roadmap.repository.UserRoadmapProgressRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Service for career tracks, roadmap nodes, and user progress.
 */
@Service
public class RoadmapService {

    private final CareerTrackRepository careerTrackRepository;
    private final RoadmapNodeRepository roadmapNodeRepository;
    private final UserRoadmapProgressRepository progressRepository;

    public RoadmapService(CareerTrackRepository careerTrackRepository,
                          RoadmapNodeRepository roadmapNodeRepository,
                          UserRoadmapProgressRepository progressRepository) {
        this.careerTrackRepository = careerTrackRepository;
        this.roadmapNodeRepository = roadmapNodeRepository;
        this.progressRepository = progressRepository;
    }

    @Transactional(readOnly = true)
    public List<CareerTrackResponse> listTracks(Long domainId) {
        List<CareerTrack> tracks = (domainId != null)
                ? careerTrackRepository.findByDomainIdAndActiveTrueOrderByNameAsc(domainId)
                : careerTrackRepository.findByActiveTrueOrderByNameAsc();
        return tracks.stream().map(CareerTrackResponse::from).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CareerTrackResponse getTrackById(Long id) {
        CareerTrack track = careerTrackRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("CareerTrack", "id", id));
        return CareerTrackResponse.from(track);
    }

    @Transactional(readOnly = true)
    public List<RoadmapNodeResponse> getNodesForTrack(Long trackId) {
        if (!careerTrackRepository.existsById(trackId)) {
            throw new ResourceNotFoundException("CareerTrack", "id", trackId);
        }
        return roadmapNodeRepository.findByCareerTrackIdOrderByOrderIndexAsc(trackId)
                .stream()
                .map(RoadmapNodeResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<UserProgressResponse> getUserProgress(UUID userId, Long trackId) {
        return progressRepository.findByUserIdAndCareerTrackId(userId, trackId)
                .stream()
                .map(UserProgressResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public UserProgressResponse updateProgress(UUID userId, Long trackId, UpdateProgressRequest request) {
        CareerTrack track = careerTrackRepository.findById(trackId)
                .orElseThrow(() -> new ResourceNotFoundException("CareerTrack", "id", trackId));
        RoadmapNode node = roadmapNodeRepository.findById(request.nodeId())
                .orElseThrow(() -> new ResourceNotFoundException("RoadmapNode", "id", request.nodeId()));

        UserRoadmapProgress progress = progressRepository
                .findByUserIdAndRoadmapNodeId(userId, node.getId())
                .orElse(new UserRoadmapProgress(userId, track, node));

        progress.setStatus(request.status());
        if ("COMPLETED".equalsIgnoreCase(request.status())) {
            progress.setCompletedAt(Instant.now());
        }
        return UserProgressResponse.from(progressRepository.save(progress));
    }
}
