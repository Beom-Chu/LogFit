package com.logfit.domain.workout.repository;

import com.logfit.domain.workout.entity.WorkoutSet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface WorkoutSetRepository extends JpaRepository<WorkoutSet, Long> {

    @Query("SELECT MAX(ws.setOrder) FROM WorkoutSet ws WHERE ws.workoutExercise.workoutExerciseId = :exerciseId")
    Optional<Integer> findMaxOrderByWorkoutExerciseId(@Param("exerciseId") Long exerciseId);
}
