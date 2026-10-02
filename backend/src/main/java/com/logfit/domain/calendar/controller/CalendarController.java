package com.logfit.domain.calendar.controller;

import com.logfit.common.response.ApiResponse;
import com.logfit.domain.calendar.dto.CalendarDateDetailResponse;
import com.logfit.domain.calendar.dto.CalendarMonthResponse;
import com.logfit.domain.calendar.service.CalendarService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.YearMonth;

@Tag(name = "Calendar", description = "캘린더 API")
@RestController
@RequestMapping("/api/v1/calendar")
@RequiredArgsConstructor
public class CalendarController {

    private final CalendarService calendarService;

    @Operation(summary = "월별 캘린더 조회")
    @GetMapping
    public ApiResponse<CalendarMonthResponse> getMonthCalendar(
            @AuthenticationPrincipal Long userId,
            @RequestParam String yearMonth) {
        YearMonth ym = YearMonth.parse(yearMonth);
        return ApiResponse.success(calendarService.getMonthCalendar(userId, ym));
    }

    @Operation(summary = "일별 상세 조회")
    @GetMapping("/days/{date}")
    public ApiResponse<CalendarDateDetailResponse> getDateDetail(
            @AuthenticationPrincipal Long userId,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ApiResponse.success(calendarService.getDateDetail(userId, date));
    }
}
