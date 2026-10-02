package com.logfit.domain.dashboard.dto;

import com.logfit.domain.statistics.dto.PrResponse;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Getter
@AllArgsConstructor
public class DashboardResponse {
    private final LatestWeightInfo latestWeight;
    private final LatestWorkoutInfo latestWorkout;
    private final PlannedWorkoutInfo plannedWorkout;
    private final List<PrResponse> latestPrs;

    @Getter
    @AllArgsConstructor
    public static class LatestWeightInfo {
        private final BigDecimal weight;
        private final LocalDate measureDate;
    }

    @Getter
    @AllArgsConstructor
    public static class LatestWorkoutInfo {
        private final Long sessionId;
        private final LocalDate workoutDate;
        private final Integer durationMinutes;
    }

    @Getter
    @AllArgsConstructor
    public static class PlannedWorkoutInfo {
        private final Long sessionId;
        private final LocalDate workoutDate;
    }
}
