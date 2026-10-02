package com.logfit.domain.statistics.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class WorkoutSummaryResponse {
    private final int totalWorkouts;
    private final int totalSets;
    private final double totalVolumeKg;
    private final Integer avgDurationMinutes;
    private final int currentStreak;
    private final int longestStreak;
}
