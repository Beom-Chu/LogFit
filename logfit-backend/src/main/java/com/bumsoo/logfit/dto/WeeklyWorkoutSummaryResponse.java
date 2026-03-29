package com.bumsoo.logfit.dto;

import java.math.BigDecimal;

public record WeeklyWorkoutSummaryResponse(
        int workoutCount,
        BigDecimal totalVolume,
        int activeDays
) {
}

