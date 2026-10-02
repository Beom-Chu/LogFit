package com.logfit.domain.exercise.service;

import com.logfit.common.exception.BusinessException;
import com.logfit.common.exception.ErrorCode;
import com.logfit.domain.exercise.entity.FavoriteExercise;
import com.logfit.domain.exercise.repository.ExerciseRepository;
import com.logfit.domain.exercise.repository.FavoriteExerciseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class FavoriteExerciseService {

    private final FavoriteExerciseRepository favoriteRepository;
    private final ExerciseRepository exerciseRepository;

    public void addFavorite(Long userId, Long exerciseId) {
        if (!exerciseRepository.existsById(exerciseId)) {
            throw new BusinessException(ErrorCode.EXERCISE_NOT_FOUND);
        }
        if (favoriteRepository.existsByUserIdAndExerciseId(userId, exerciseId)) {
            throw new BusinessException(ErrorCode.FAVORITE_ALREADY_EXISTS);
        }
        favoriteRepository.save(FavoriteExercise.builder()
                .userId(userId)
                .exerciseId(exerciseId)
                .build());
    }

    public void removeFavorite(Long userId, Long exerciseId) {
        FavoriteExercise favorite = favoriteRepository.findByUserIdAndExerciseId(userId, exerciseId)
                .orElseThrow(() -> new BusinessException(ErrorCode.FAVORITE_NOT_FOUND));
        favoriteRepository.delete(favorite);
    }
}
