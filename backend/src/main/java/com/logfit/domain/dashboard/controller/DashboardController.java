package com.logfit.domain.dashboard.controller;

import com.logfit.common.response.ApiResponse;
import com.logfit.domain.dashboard.dto.DashboardResponse;
import com.logfit.domain.dashboard.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Dashboard", description = "대시보드 API")
@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @Operation(summary = "대시보드 조회")
    @GetMapping
    public ApiResponse<DashboardResponse> getDashboard(@AuthenticationPrincipal Long userId) {
        return ApiResponse.success(dashboardService.getDashboard(userId));
    }
}
