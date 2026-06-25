package com.learnpath.dashboard.controller;

import com.learnpath.common.response.ApiResponse;
import com.learnpath.dashboard.dto.DashboardResponse;
import com.learnpath.dashboard.service.DashboardService;
import com.learnpath.security.UserPrincipal;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<DashboardResponse>> getDashboard(
            @AuthenticationPrincipal UserPrincipal principal) {
        DashboardResponse dashboard = dashboardService.getDashboard(principal.getId());
        return ResponseEntity.ok(ApiResponse.ok(dashboard));
    }
}
