package com.learnpath.domain.service;

import com.learnpath.domain.dto.DomainResponse;
import com.learnpath.domain.entity.Domain;
import com.learnpath.domain.repository.DomainRepository;
import com.learnpath.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for domain lookup operations.
 *
 * <p>Domains are seeded via Flyway and are read-heavy; writes are admin-only.
 */
@Service
public class DomainService {

    private final DomainRepository domainRepository;

    public DomainService(DomainRepository domainRepository) {
        this.domainRepository = domainRepository;
    }

    /** Returns all active domains ordered by name. */
    @Transactional(readOnly = true)
    public List<DomainResponse> listActiveDomains() {
        return domainRepository.findByActiveTrueOrderByNameAsc()
                .stream()
                .map(DomainResponse::from)
                .collect(Collectors.toList());
    }

    /** Returns a single domain by id, throwing 404 if not found. */
    @Transactional(readOnly = true)
    public DomainResponse getDomainById(Long id) {
        Domain domain = domainRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Domain", "id", id));
        return DomainResponse.from(domain);
    }

    /** Returns a single domain by code, throwing 404 if not found. */
    @Transactional(readOnly = true)
    public DomainResponse getDomainByCode(String code) {
        Domain domain = domainRepository.findByCode(code)
                .orElseThrow(() -> new ResourceNotFoundException("Domain", "code", code));
        return DomainResponse.from(domain);
    }
}
