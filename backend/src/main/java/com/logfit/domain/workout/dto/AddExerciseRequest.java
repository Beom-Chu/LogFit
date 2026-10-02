package com.logfit.domain.workout.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class AddExerciseRequest {
    @NotNull
    private Long exerciseId;
}
