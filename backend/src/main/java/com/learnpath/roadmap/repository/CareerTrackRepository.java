package com.learnpath.roadmap.repository;

import com.learnpath.roadmap.entity.CareerTrack;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CareerTrackRepository extends JpaRepository<CareerTrack, Long> {
    List<CareerTrack> findByActiveTrueOrderByNameAsc();
    List<CareerTrack> findByDomainIdAndActiveTrueOrderByNameAsc(Long domainId);
}
