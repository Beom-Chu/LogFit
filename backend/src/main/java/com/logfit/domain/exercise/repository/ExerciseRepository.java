package com.logfit.domain.exercise.repository;

import com.logfit.domain.exercise.entity.Exercise;
import com.logfit.domain.exercise.entity.MuscleGroup;
import com.logfit.domain.exercise.entity.ExerciseSourceType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ExerciseRepository extends JpaRepository<Exercise, Long> {

    @Query("""
        SELECT e FROM Exercise e
        WHERE e.isDeleted = false
          AND (e.sourceType = 'SYSTEM' OR e.ownerUserId = :userId)
          AND (:keyword IS NULL OR LOWER(e.name) LIKE LOWER(CONCAT('%', :keyword, '%')))
          AND (:muscleGroup IS NULL OR e.muscleGroup = :muscleGroup)
          AND (:sourceType IS NULL OR e.sourceType = :sourceType)
        """)
    Page<Exercise> findExercises(
            @Param("userId") Long userId,
            @Param("keyword") String keyword,
            @Param("muscleGroup") MuscleGroup muscleGroup,
            @Param("sourceType") ExerciseSourceType sourceType,
            Pageable pageable);

    @Query("""
        SELECT e FROM Exercise e
        JOIN FavoriteExercise f ON f.exerciseId = e.exerciseId AND f.userId = :userId
        WHERE e.isDeleted = false
          AND (:keyword IS NULL OR LOWER(e.name) LIKE LOWER(CONCAT('%', :keyword, '%')))
          AND (:muscleGroup IS NULL OR e.muscleGroup = :muscleGroup)
        """)
    Page<Exercise> findFavoriteExercises(
            @Param("userId") Long userId,
            @Param("keyword") String keyword,
            @Param("muscleGroup") MuscleGroup muscleGroup,
            Pageable pageable);

    Optional<Exercise> findByExerciseIdAndIsDeletedFalse(Long exerciseId);
}
