package com.logfit.domain.calendar.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@AllArgsConstructor
public class CalendarDayResponse {
    private LocalDate date;
    private boolean hasPlannedWorkout;
    private boolean hasCompletedWorkout;
    private boolean hasInProgressWorkout;
    private int workoutCount;
    private Integer totalDurationMinutes;
}
