package com.logfit.domain.calendar.service;

import com.logfit.domain.calendar.dto.CalendarDateDetailResponse;
import com.logfit.domain.calendar.dto.CalendarDayResponse;
import com.logfit.domain.calendar.dto.CalendarMonthResponse;
import com.logfit.domain.workout.dto.WorkoutSessionSummary;
import com.logfit.domain.workout.entity.WorkoutSession;
import com.logfit.domain.workout.entity.WorkoutSessionStatus;
import com.logfit.domain.workout.repository.WorkoutSessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CalendarService {

    private final WorkoutSessionRepository sessionRepository;

    public CalendarMonthResponse getMonthCalendar(Long userId, YearMonth yearMonth) {
        LocalDate start = yearMonth.atDay(1);
        LocalDate end = yearMonth.atEndOfMonth();

        List<WorkoutSession> sessions = sessionRepository.findByUserIdAndWorkoutDateBetween(userId, start, end);
        Map<LocalDate, List<WorkoutSession>> byDate = sessions.stream()
                .collect(Collectors.groupingBy(WorkoutSession::getWorkoutDate));

        List<CalendarDayResponse> days = new ArrayList<>();
        for (LocalDate date = start; !date.isAfter(end); date = date.plusDays(1)) {
            List<WorkoutSession> daySessions = byDate.getOrDefault(date, List.of());
            boolean hasPlanned = daySessions.stream().anyMatch(s -> s.getStatus() == WorkoutSessionStatus.PLANNED);
            boolean hasCompleted = daySessions.stream().anyMatch(s -> s.getStatus() == WorkoutSessionStatus.COMPLETED);
            boolean hasInProgress = daySessions.stream().anyMatch(s -> s.getStatus() == WorkoutSessionStatus.IN_PROGRESS);
            int count = daySessions.size();
            Integer totalDuration = daySessions.stream()
                    .map(WorkoutSession::getTotalDurationMinutes)
                    .filter(d -> d != null)
                    .reduce(0, Integer::sum);
            days.add(new CalendarDayResponse(date, hasPlanned, hasCompleted, hasInProgress, count, totalDuration == 0 ? null : totalDuration));
        }
        return new CalendarMonthResponse(yearMonth.toString(), days);
    }

    public CalendarDateDetailResponse getDateDetail(Long userId, LocalDate date) {
        List<WorkoutSession> sessions = sessionRepository.findByUserIdAndWorkoutDateBetween(userId, date, date);
        List<WorkoutSessionSummary> summaries = sessions.stream()
                .map(WorkoutSessionSummary::new).toList();
        return new CalendarDateDetailResponse(date, summaries);
    }
}
