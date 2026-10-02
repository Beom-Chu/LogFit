package com.logfit.domain.exercise.dto;

import com.logfit.domain.exercise.entity.Exercise;
import com.logfit.domain.exercise.entity.ExerciseSourceType;
import com.logfit.domain.exercise.entity.MuscleGroup;
import com.logfit.domain.exercise.entity.TrackingType;
import lombok.Getter;

@Getter
public class ExerciseResponse {
    private final Long exerciseId;
    private final String name;
    private final MuscleGroup muscleGroup;
    private final ExerciseSourceType sourceType;
    private final TrackingType trackingType;
    private final boolean isFavorite;

    public ExerciseResponse(Exercise exercise, boolean isFavorite) {
        this.exerciseId = exercise.getExerciseId();
        this.name = exercise.getName();
        this.muscleGroup = exercise.getMuscleGroup();
        this.sourceType = exercise.getSourceType();
        this.trackingType = exercise.getTrackingType();
        this.isFavorite = isFavorite;
    }
}
