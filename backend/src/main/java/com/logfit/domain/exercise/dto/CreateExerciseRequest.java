package com.logfit.domain.exercise.dto;

import com.logfit.domain.exercise.entity.MuscleGroup;
import com.logfit.domain.exercise.entity.TrackingType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;

@Getter
public class CreateExerciseRequest {
    @NotBlank @Size(min = 1, max = 100)
    private String name;

    @NotNull
    private MuscleGroup muscleGroup;

    @NotNull
    private TrackingType trackingType;
}
