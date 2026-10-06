package com.logfit.domain.exercise.repository;

import com.logfit.domain.exercise.entity.FavoriteExercise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.Set;

public interface FavoriteExerciseRepository extends JpaRepository<FavoriteExercise, Long> {
    Optional<FavoriteExercise> findByUserIdAndExerciseId(Long userId, Long exerciseId);
    boolean existsByUserIdAndExerciseId(Long userId, Long exerciseId);

    @Query("SELECT f.exerciseId FROM FavoriteExercise f WHERE f.userId = :userId")
    Set<Long> findExerciseIdsByUserId(@Param("userId") Long userId);
}
