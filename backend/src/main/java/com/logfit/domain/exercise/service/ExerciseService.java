package com.logfit.domain.exercise.service;

import com.logfit.common.exception.BusinessException;
import com.logfit.common.exception.ErrorCode;
import com.logfit.common.response.PageResponse;
import com.logfit.domain.exercise.dto.CreateExerciseRequest;
import com.logfit.domain.exercise.dto.ExerciseResponse;
import com.logfit.domain.exercise.dto.UpdateExerciseRequest;
import com.logfit.domain.exercise.entity.*;
import com.logfit.domain.exercise.repository.ExerciseRepository;
import com.logfit.domain.exercise.repository.FavoriteExerciseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ExerciseService {

    private final ExerciseRepository exerciseRepository;
    private final FavoriteExerciseRepository favoriteRepository;

    public PageResponse<ExerciseResponse> getExercises(Long userId, String keyword, MuscleGroup muscleGroup,
                                                        ExerciseSourceType sourceType, boolean favoriteOnly,
                                                        int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        // Build lower'd '%keyword%' pattern here to avoid Hibernate 6 + PostgreSQL lower(bytea) bug.
        String keywordPattern = (keyword != null && !keyword.isBlank())
                ? "%" + keyword.toLowerCase() + "%" : null;
        Page<Exercise> exercises;
        if (favoriteOnly) {
            exercises = exerciseRepository.findFavoriteExercises(userId, keywordPattern, muscleGroup, pageable);
        } else {
            exercises = exerciseRepository.findExercises(userId, keywordPattern, muscleGroup, sourceType, pageable);
        }
        Set<Long> favoriteIds = favoriteRepository.findExerciseIdsByUserId(userId);
        Page<ExerciseResponse> responsePage = exercises.map(e -> new ExerciseResponse(e, favoriteIds.contains(e.getExerciseId())));
        return PageResponse.of(responsePage);
    }

    public ExerciseResponse getExercise(Long userId, Long exerciseId) {
        Exercise exercise = exerciseRepository.findByExerciseIdAndIsDeletedFalse(exerciseId)
                .orElseThrow(() -> new BusinessException(ErrorCode.EXERCISE_NOT_FOUND));
        boolean isFavorite = favoriteRepository.existsByUserIdAndExerciseId(userId, exerciseId);
        return new ExerciseResponse(exercise, isFavorite);
    }

    @Transactional
    public ExerciseResponse createExercise(Long userId, CreateExerciseRequest request) {
        Exercise exercise = Exercise.builder()
                .ownerUserId(userId)
                .name(request.getName())
                .muscleGroup(request.getMuscleGroup())
                .sourceType(ExerciseSourceType.CUSTOM)
                .trackingType(request.getTrackingType())
                .build();
        exerciseRepository.save(exercise);
        return new ExerciseResponse(exercise, false);
    }

    @Transactional
    public ExerciseResponse updateExercise(Long userId, Long exerciseId, UpdateExerciseRequest request) {
        Exercise exercise = exerciseRepository.findByExerciseIdAndIsDeletedFalse(exerciseId)
                .orElseThrow(() -> new BusinessException(ErrorCode.EXERCISE_NOT_FOUND));
        if (exercise.isSystem() || !exercise.isOwnedBy(userId)) {
            throw new BusinessException(ErrorCode.EXERCISE_MODIFY_FORBIDDEN);
        }
        exercise.update(request.getName(), request.getMuscleGroup(), request.getTrackingType());
        boolean isFavorite = favoriteRepository.existsByUserIdAndExerciseId(userId, exerciseId);
        return new ExerciseResponse(exercise, isFavorite);
    }

    @Transactional
    public void deleteExercise(Long userId, Long exerciseId) {
        Exercise exercise = exerciseRepository.findByExerciseIdAndIsDeletedFalse(exerciseId)
                .orElseThrow(() -> new BusinessException(ErrorCode.EXERCISE_NOT_FOUND));
        if (exercise.isSystem() || !exercise.isOwnedBy(userId)) {
            throw new BusinessException(ErrorCode.EXERCISE_MODIFY_FORBIDDEN);
        }
        exercise.delete();
    }

    public Exercise getExerciseEntity(Long exerciseId) {
        return exerciseRepository.findByExerciseIdAndIsDeletedFalse(exerciseId)
                .orElseThrow(() -> new BusinessException(ErrorCode.EXERCISE_NOT_FOUND));
    }
}
