package com.logfit.domain.statistics.controller;

import com.logfit.common.response.ApiResponse;
import com.logfit.domain.body.dto.BodyCompositionChartPoint;
import com.logfit.domain.statistics.dto.*;
import com.logfit.domain.statistics.service.StatisticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@Tag(name = "Statistics", description = "통계 API")
@RestController
@RequestMapping("/api/v1/statistics")
@RequiredArgsConstructor
public class StatisticsController {

    private final StatisticsService statisticsService;

    @Operation(summary = "운동 PR 조회")
    @GetMapping("/pr")
    public ApiResponse<List<PrResponse>> getPRs(@AuthenticationPrincipal Long userId) {
        return ApiResponse.success(statisticsService.getPRs(userId));
    }

    @Operation(summary = "1RM 추정치 조회")
    @GetMapping("/1rm")
    public ApiResponse<List<OneRmResponse>> get1RMs(@AuthenticationPrincipal Long userId) {
        return ApiResponse.success(statisticsService.get1RMs(userId));
    }

    @Operation(summary = "운동 볼륨 추이 조회")
    @GetMapping("/volume")
    public ApiResponse<List<VolumePoint>> getVolume(
            @AuthenticationPrincipal Long userId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return ApiResponse.success(statisticsService.getVolume(userId, from, to));
    }

    @Operation(summary = "근육 부위별 분포 조회")
    @GetMapping("/muscles")
    public ApiResponse<MuscleDistributionResponse> getMuscleDistribution(@AuthenticationPrincipal Long userId) {
        return ApiResponse.success(statisticsService.getMuscleDistribution(userId));
    }

    @Operation(summary = "체성분 추이 조회")
    @GetMapping("/body")
    public ApiResponse<List<BodyCompositionChartPoint>> getBodyTrend(
            @AuthenticationPrincipal Long userId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return ApiResponse.success(statisticsService.getBodyTrend(userId, from, to));
    }

    @Operation(summary = "운동 요약 통계 조회")
    @GetMapping("/workout-summary")
    public ApiResponse<WorkoutSummaryResponse> getWorkoutSummary(@AuthenticationPrincipal Long userId) {
        return ApiResponse.success(statisticsService.getWorkoutSummary(userId));
    }
}
