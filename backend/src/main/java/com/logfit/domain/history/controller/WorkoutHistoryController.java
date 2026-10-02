package com.logfit.domain.history.controller;

import com.logfit.common.response.ApiResponse;
import com.logfit.domain.history.dto.WorkoutHistoryDetailResponse;
import com.logfit.domain.history.service.WorkoutHistoryService;
import com.logfit.domain.workout.dto.WorkoutSessionSummary;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Workout History", description = "운동 이력 API")
@RestController
@RequestMapping("/api/v1/workout-history")
@RequiredArgsConstructor
public class WorkoutHistoryController {

    private final WorkoutHistoryService workoutHistoryService;

    @Operation(summary = "운동 이력 목록 조회")
    @GetMapping
    public ApiResponse<List<WorkoutSessionSummary>> getHistory(@AuthenticationPrincipal Long userId) {
        return ApiResponse.success(workoutHistoryService.getHistory(userId));
    }

    @Operation(summary = "운동 이력 상세 조회")
    @GetMapping("/{sessionId}")
    public ApiResponse<WorkoutHistoryDetailResponse> getHistoryDetail(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long sessionId) {
        return ApiResponse.success(workoutHistoryService.getHistoryDetail(userId, sessionId));
    }
}
