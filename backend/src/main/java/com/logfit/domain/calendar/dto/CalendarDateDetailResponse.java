package com.logfit.domain.calendar.dto;

import com.logfit.domain.workout.dto.WorkoutSessionSummary;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDate;
import java.util.List;

@Getter
@AllArgsConstructor
public class CalendarDateDetailResponse {
    private LocalDate date;
    private List<WorkoutSessionSummary> sessions;
}
