package com.logfit.domain.calendar.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class CalendarMonthResponse {
    private String yearMonth;
    private List<CalendarDayResponse> days;
}
