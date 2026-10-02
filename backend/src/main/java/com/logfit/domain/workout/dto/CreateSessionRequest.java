package com.logfit.domain.workout.dto;

import com.logfit.domain.workout.entity.WorkoutSessionStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

import java.time.LocalDate;

@Getter
public class CreateSessionRequest {
    @NotNull
    private LocalDate workoutDate;
    private String memo;
    private WorkoutSessionStatus status;
}
