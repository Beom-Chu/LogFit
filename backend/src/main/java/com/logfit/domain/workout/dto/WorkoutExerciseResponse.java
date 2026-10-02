package com.logfit.domain.workout.dto;

import com.logfit.domain.exercise.entity.MuscleGroup;
import com.logfit.domain.workout.entity.WorkoutExercise;
import lombok.Getter;

import java.util.List;

@Getter
public class WorkoutExerciseResponse {
    private final Long workoutExerciseId;
    private final Long exerciseId;
    private final String exerciseName;
    private final MuscleGroup muscleGroup;
    private final int exerciseOrder;
    private final List<WorkoutSetResponse> sets;

    public WorkoutExerciseResponse(WorkoutExercise we) {
        this.workoutExerciseId = we.getWorkoutExerciseId();
        this.exerciseId = we.getExerciseId();
        this.exerciseName = we.getExerciseNameSnapshot();
        this.muscleGroup = we.getMuscleGroupSnapshot();
        this.exerciseOrder = we.getExerciseOrder();
        this.sets = we.getWorkoutSets().stream().map(WorkoutSetResponse::new).toList();
    }
}
