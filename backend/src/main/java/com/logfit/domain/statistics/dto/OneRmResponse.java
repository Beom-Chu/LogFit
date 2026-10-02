package com.logfit.domain.statistics.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@AllArgsConstructor
public class OneRmResponse {
    private final Long exerciseId;
    private final String exerciseName;
    private final double estimated1RM;
    private final LocalDate achievedDate;
}
