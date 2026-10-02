package com.logfit.domain.workout.repository;

import com.logfit.domain.workout.entity.WorkoutExercise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface WorkoutExerciseRepository extends JpaRepository<WorkoutExercise, Long> {

    @Query("SELECT MAX(we.exerciseOrder) FROM WorkoutExercise we WHERE we.workoutSession.sessionId = :sessionId")
    Optional<Integer> findMaxOrderBySessionId(@Param("sessionId") Long sessionId);

    List<WorkoutExercise> findByWorkoutSession_SessionId(Long sessionId);
}
