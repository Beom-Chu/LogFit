package com.logfit.domain.dashboard.service;

import com.logfit.domain.body.entity.BodyWeight;
import com.logfit.domain.body.repository.BodyWeightRepository;
import com.logfit.domain.dashboard.dto.DashboardResponse;
import com.logfit.domain.statistics.dto.PrResponse;
import com.logfit.domain.statistics.service.StatisticsService;
import com.logfit.domain.workout.entity.WorkoutSession;
import com.logfit.domain.workout.repository.WorkoutSessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardService {

    private final BodyWeightRepository bodyWeightRepository;
    private final WorkoutSessionRepository sessionRepository;
    private final StatisticsService statisticsService;

    public DashboardResponse getDashboard(Long userId) {
        DashboardResponse.LatestWeightInfo weightInfo = bodyWeightRepository.findLatestByUserId(userId)
                .map(bw -> new DashboardResponse.LatestWeightInfo(bw.getWeight(), bw.getMeasureDate()))
                .orElse(null);

        DashboardResponse.LatestWorkoutInfo latestWorkout = sessionRepository.findLatestCompletedByUserId(userId)
                .map(s -> new DashboardResponse.LatestWorkoutInfo(s.getSessionId(), s.getWorkoutDate(), s.getTotalDurationMinutes()))
                .orElse(null);

        DashboardResponse.PlannedWorkoutInfo plannedWorkout = sessionRepository.findNearestPlannedByUserId(userId, LocalDate.now())
                .map(s -> new DashboardResponse.PlannedWorkoutInfo(s.getSessionId(), s.getWorkoutDate()))
                .orElse(null);

        List<PrResponse> latestPrs = statisticsService.getPRs(userId).stream().limit(5).toList();

        return new DashboardResponse(weightInfo, latestWorkout, plannedWorkout, latestPrs);
    }
}
