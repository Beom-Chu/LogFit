package com.logfit.domain.statistics.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@AllArgsConstructor
public class PrResponse {
    private final Long exerciseId;
    private final String exerciseName;
    private final BigDecimal maxWeight;
    private final int repsAtMaxWeight;
    private final LocalDate achievedDate;
}
