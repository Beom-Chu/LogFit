package com.logfit.domain.statistics.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class MuscleDistributionResponse {
    private final List<MuscleShare> distribution;

    @Getter
    @AllArgsConstructor
    public static class MuscleShare {
        private final String muscleGroup;
        private final int count;
        private final double percentage;
    }
}
