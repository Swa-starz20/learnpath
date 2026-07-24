package com.learnpath.domain.controller;

import com.learnpath.common.response.ApiResponse;
import com.learnpath.domain.dto.DomainResponse;
import com.learnpath.domain.service.DomainService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for domain lookup.
 *
 * <p>Base path: {@code /api/v1/domains}
 */
@RestController
@RequestMapping("/api/v1/domains")
public class DomainController {

    private final DomainService domainService;

    public DomainController(DomainService domainService) {
        this.domainService = domainService;
    }

    /** GET /api/v1/domains — list all active engineering domains. */
    @GetMapping
    public ResponseEntity<ApiResponse<List<DomainResponse>>> listDomains() {
        return ResponseEntity.ok(ApiResponse.ok(domainService.listActiveDomains()));
    }

    /** GET /api/v1/domains/{id} — get domain by id. */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DomainResponse>> getDomain(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(domainService.getDomainById(id)));
    }

    /** GET /api/v1/domains/code/{code} — get domain by code. */
    @GetMapping("/code/{code}")
    public ResponseEntity<ApiResponse<DomainResponse>> getDomainByCode(@PathVariable String code) {
        return ResponseEntity.ok(ApiResponse.ok(domainService.getDomainByCode(code)));
    }
}
