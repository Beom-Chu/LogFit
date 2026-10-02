package com.logfit.domain.exercise.controller;

import com.logfit.common.response.ApiResponse;
import com.logfit.common.response.PageResponse;
import com.logfit.domain.exercise.dto.CreateExerciseRequest;
import com.logfit.domain.exercise.dto.ExerciseResponse;
import com.logfit.domain.exercise.dto.UpdateExerciseRequest;
import com.logfit.domain.exercise.entity.ExerciseSourceType;
import com.logfit.domain.exercise.entity.MuscleGroup;
import com.logfit.domain.exercise.service.ExerciseService;
import com.logfit.domain.exercise.service.FavoriteExerciseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Exercise", description = "운동 API")
@RestController
@RequestMapping("/api/v1/exercises")
@RequiredArgsConstructor
public class ExerciseController {

    private final ExerciseService exerciseService;
    private final FavoriteExerciseService favoriteExerciseService;

    @Operation(summary = "운동 목록 조회")
    @GetMapping
    public ApiResponse<PageResponse<ExerciseResponse>> getExercises(
            @AuthenticationPrincipal Long userId,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) MuscleGroup muscleGroup,
            @RequestParam(required = false) ExerciseSourceType sourceType,
            @RequestParam(defaultValue = "false") boolean favoriteOnly,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.success(
                exerciseService.getExercises(userId, keyword, muscleGroup, sourceType, favoriteOnly, page, size));
    }

    @Operation(summary = "운동 상세 조회")
    @GetMapping("/{exerciseId}")
    public ApiResponse<ExerciseResponse> getExercise(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long exerciseId) {
        return ApiResponse.success(exerciseService.getExercise(userId, exerciseId));
    }

    @Operation(summary = "운동 생성 (커스텀)")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<ExerciseResponse> createExercise(
            @AuthenticationPrincipal Long userId,
            @Valid @RequestBody CreateExerciseRequest request) {
        return ApiResponse.success(exerciseService.createExercise(userId, request));
    }

    @Operation(summary = "운동 수정 (커스텀만)")
    @PutMapping("/{exerciseId}")
    public ApiResponse<ExerciseResponse> updateExercise(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long exerciseId,
            @Valid @RequestBody UpdateExerciseRequest request) {
        return ApiResponse.success(exerciseService.updateExercise(userId, exerciseId, request));
    }

    @Operation(summary = "운동 삭제 (커스텀만)")
    @DeleteMapping("/{exerciseId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteExercise(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long exerciseId) {
        exerciseService.deleteExercise(userId, exerciseId);
    }

    @Operation(summary = "즐겨찾기 추가")
    @PostMapping("/{exerciseId}/favorite")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<Void> addFavorite(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long exerciseId) {
        favoriteExerciseService.addFavorite(userId, exerciseId);
        return ApiResponse.success();
    }

    @Operation(summary = "즐겨찾기 삭제")
    @DeleteMapping("/{exerciseId}/favorite")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeFavorite(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long exerciseId) {
        favoriteExerciseService.removeFavorite(userId, exerciseId);
    }
}
