package com.logfit.domain.workout.controller;

import com.logfit.common.response.ApiResponse;
import com.logfit.domain.workout.dto.*;
import com.logfit.domain.workout.service.WorkoutSessionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Workout Session", description = "운동 세션 API")
@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class WorkoutSessionController {

    private final WorkoutSessionService workoutSessionService;

    @Operation(summary = "운동 세션 생성")
    @PostMapping("/workout-sessions")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<WorkoutSessionResponse> createSession(
            @AuthenticationPrincipal Long userId,
            @Valid @RequestBody CreateSessionRequest request) {
        return ApiResponse.success(workoutSessionService.createSession(userId, request));
    }

    @Operation(summary = "운동 시작")
    @PostMapping("/workout-sessions/{sessionId}/start")
    public ApiResponse<WorkoutSessionResponse> startSession(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long sessionId) {
        return ApiResponse.success(workoutSessionService.startSession(userId, sessionId));
    }

    @Operation(summary = "운동 완료")
    @PostMapping("/workout-sessions/{sessionId}/complete")
    public ApiResponse<WorkoutSessionResponse> completeSession(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long sessionId) {
        return ApiResponse.success(workoutSessionService.completeSession(userId, sessionId));
    }

    @Operation(summary = "진행 중 운동 조회")
    @GetMapping("/workout-sessions/current")
    public ApiResponse<WorkoutSessionResponse> getCurrentSession(
            @AuthenticationPrincipal Long userId) {
        return ApiResponse.success(workoutSessionService.getCurrentSession(userId));
    }

    @Operation(summary = "계획된 운동 목록 조회")
    @GetMapping("/workout-sessions/planned")
    public ApiResponse<List<WorkoutSessionSummary>> getPlannedSessions(
            @AuthenticationPrincipal Long userId) {
        return ApiResponse.success(workoutSessionService.getPlannedSessions(userId));
    }

    @Operation(summary = "운동 세션 상세 조회")
    @GetMapping("/workout-sessions/{sessionId}")
    public ApiResponse<WorkoutSessionResponse> getSession(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long sessionId) {
        return ApiResponse.success(workoutSessionService.getSession(userId, sessionId));
    }

    @Operation(summary = "운동 세션 삭제")
    @DeleteMapping("/workout-sessions/{sessionId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteSession(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long sessionId) {
        workoutSessionService.deleteSession(userId, sessionId);
    }

    @Operation(summary = "메모 수정")
    @PatchMapping("/workout-sessions/{sessionId}/memo")
    public ApiResponse<WorkoutSessionResponse> updateMemo(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long sessionId,
            @RequestBody UpdateMemoRequest request) {
        return ApiResponse.success(workoutSessionService.updateMemo(userId, sessionId, request));
    }

    @Operation(summary = "운동 추가")
    @PostMapping("/workout-sessions/{sessionId}/exercises")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<WorkoutExerciseResponse> addExercise(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long sessionId,
            @Valid @RequestBody AddExerciseRequest request) {
        return ApiResponse.success(workoutSessionService.addExercise(userId, sessionId, request));
    }

    @Operation(summary = "운동 삭제")
    @DeleteMapping("/workout-exercises/{workoutExerciseId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteExercise(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long workoutExerciseId) {
        workoutSessionService.deleteExercise(userId, workoutExerciseId);
    }

    @Operation(summary = "세트 추가")
    @PostMapping("/workout-exercises/{workoutExerciseId}/sets")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<WorkoutSetResponse> addSet(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long workoutExerciseId,
            @RequestBody AddSetRequest request) {
        return ApiResponse.success(workoutSessionService.addSet(userId, workoutExerciseId, request));
    }

    @Operation(summary = "세트 수정")
    @PutMapping("/workout-sets/{setId}")
    public ApiResponse<WorkoutSetResponse> updateSet(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long setId,
            @RequestBody UpdateSetRequest request) {
        return ApiResponse.success(workoutSessionService.updateSet(userId, setId, request));
    }

    @Operation(summary = "세트 삭제")
    @DeleteMapping("/workout-sets/{setId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteSet(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long setId) {
        workoutSessionService.deleteSet(userId, setId);
    }

    @Operation(summary = "세트 완료 토글")
    @PatchMapping("/workout-sets/{setId}/complete")
    public ApiResponse<WorkoutSetResponse> toggleSetComplete(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long setId) {
        return ApiResponse.success(workoutSessionService.toggleSetComplete(userId, setId));
    }

}
