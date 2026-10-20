package com.logfit.domain.workout.dto;

import jakarta.validation.constraints.PositiveOrZero;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
public class UpdateSetRequest {
    @PositiveOrZero
    private BigDecimal weight;
    @PositiveOrZero
    private int reps;
    @PositiveOrZero
    private int durationSeconds;
    @PositiveOrZero
    private BigDecimal distanceKm;
}
