package com.logfit.domain.workout.dto;

import jakarta.validation.constraints.PositiveOrZero;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
public class AddSetRequest {
    @PositiveOrZero
    private BigDecimal weight;
    private int reps;
}
