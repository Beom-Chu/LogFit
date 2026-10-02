package com.logfit.domain.exercise.repository;

import com.logfit.domain.exercise.entity.FavoriteExercise;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.Set;

public interface FavoriteExerciseRepository extends JpaRepository<FavoriteExercise, Long> {
    Optional<FavoriteExercise> findByUserIdAndExerciseId(Long userId, Long exerciseId);
    boolean existsByUserIdAndExerciseId(Long userId, Long exerciseId);
    Set<Long> findExerciseIdsByUserId(Long userId);
}
