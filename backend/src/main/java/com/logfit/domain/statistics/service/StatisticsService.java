package com.logfit.domain.statistics.service;

import com.logfit.domain.body.dto.BodyCompositionChartPoint;
import com.logfit.domain.body.repository.BodyCompositionRepository;
import com.logfit.domain.statistics.dto.*;
import com.logfit.domain.workout.entity.*;
import com.logfit.domain.workout.repository.WorkoutSessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class StatisticsService {

    private final WorkoutSessionRepository sessionRepository;
    private final BodyCompositionRepository bodyCompositionRepository;

    public List<PrResponse> getPRs(Long userId) {
        List<WorkoutSession> sessions = sessionRepository.findCompletedByUserId(userId);
        // Group sets by exerciseId, find max weight per exercise
        Map<Long, PrCandidate> prMap = new HashMap<>();
        for (WorkoutSession session : sessions) {
            for (WorkoutExercise we : session.getWorkoutExercises()) {
                for (WorkoutSet ws : we.getWorkoutSets()) {
                    double weight = ws.getWeight().doubleValue();
                    PrCandidate existing = prMap.get(we.getExerciseId());
                    if (existing == null || weight > existing.maxWeight.doubleValue()) {
                        prMap.put(we.getExerciseId(), new PrCandidate(
                                we.getExerciseId(), we.getExerciseNameSnapshot(),
                                ws.getWeight(), ws.getReps(), session.getWorkoutDate()));
                    }
                }
            }
        }
        return prMap.values().stream()
                .map(c -> new PrResponse(c.exerciseId, c.exerciseName, c.maxWeight, c.reps, c.date))
                .sorted(Comparator.comparing(PrResponse::getExerciseName))
                .toList();
    }

    public List<OneRmResponse> get1RMs(Long userId) {
        List<WorkoutSession> sessions = sessionRepository.findCompletedByUserId(userId);
        Map<Long, OneRmCandidate> map = new HashMap<>();
        for (WorkoutSession session : sessions) {
            for (WorkoutExercise we : session.getWorkoutExercises()) {
                for (WorkoutSet ws : we.getWorkoutSets()) {
                    double orm = ws.calculate1RM();
                    OneRmCandidate existing = map.get(we.getExerciseId());
                    if (existing == null || orm > existing.estimated1RM) {
                        map.put(we.getExerciseId(), new OneRmCandidate(
                                we.getExerciseId(), we.getExerciseNameSnapshot(), orm, session.getWorkoutDate()));
                    }
                }
            }
        }
        return map.values().stream()
                .map(c -> new OneRmResponse(c.exerciseId, c.exerciseName, Math.round(c.estimated1RM * 10.0) / 10.0, c.date))
                .sorted(Comparator.comparing(OneRmResponse::getExerciseName))
                .toList();
    }

    public List<VolumePoint> getVolume(Long userId, LocalDate from, LocalDate to) {
        LocalDate end = to != null ? to : LocalDate.now();
        LocalDate start = from != null ? from : end.minusDays(29);
        List<WorkoutSession> sessions = sessionRepository.findByUserIdAndWorkoutDateBetween(userId, start, end)
                .stream().filter(s -> s.getStatus() == WorkoutSessionStatus.COMPLETED).toList();

        Map<LocalDate, Double> volumeByDate = new TreeMap<>();
        for (WorkoutSession session : sessions) {
            double vol = session.getWorkoutExercises().stream()
                    .flatMap(we -> we.getWorkoutSets().stream())
                    .mapToDouble(ws -> ws.getWeight().doubleValue() * ws.getReps())
                    .sum();
            volumeByDate.merge(session.getWorkoutDate(), vol, Double::sum);
        }
        return volumeByDate.entrySet().stream()
                .map(e -> new VolumePoint(e.getKey(), Math.round(e.getValue() * 10.0) / 10.0))
                .toList();
    }

    public MuscleDistributionResponse getMuscleDistribution(Long userId) {
        List<WorkoutSession> sessions = sessionRepository.findCompletedByUserId(userId);
        Map<String, Integer> countMap = new LinkedHashMap<>();
        for (WorkoutSession session : sessions) {
            for (WorkoutExercise we : session.getWorkoutExercises()) {
                String muscle = we.getMuscleGroupSnapshot().name();
                countMap.merge(muscle, 1, Integer::sum);
            }
        }
        int total = countMap.values().stream().mapToInt(i -> i).sum();
        List<MuscleDistributionResponse.MuscleShare> shares = countMap.entrySet().stream()
                .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
                .map(e -> new MuscleDistributionResponse.MuscleShare(
                        e.getKey(), e.getValue(),
                        total == 0 ? 0 : Math.round(e.getValue() * 1000.0 / total) / 10.0))
                .toList();
        return new MuscleDistributionResponse(shares);
    }

    public List<BodyCompositionChartPoint> getBodyTrend(Long userId, LocalDate from, LocalDate to) {
        LocalDate end = to != null ? to : LocalDate.now();
        LocalDate start = from != null ? from : end.minusDays(89);
        return bodyCompositionRepository.findChartData(userId, start, end)
                .stream().map(BodyCompositionChartPoint::new).toList();
    }

    public WorkoutSummaryResponse getWorkoutSummary(Long userId) {
        List<WorkoutSession> sessions = sessionRepository.findCompletedByUserId(userId);
        int totalWorkouts = sessions.size();
        int totalSets = 0;
        double totalVolume = 0;
        long totalDuration = 0;
        int sessionWithDuration = 0;
        for (WorkoutSession s : sessions) {
            if (s.getTotalDurationMinutes() != null) {
                totalDuration += s.getTotalDurationMinutes();
                sessionWithDuration++;
            }
            for (WorkoutExercise we : s.getWorkoutExercises()) {
                for (WorkoutSet ws : we.getWorkoutSets()) {
                    totalSets++;
                    totalVolume += ws.getWeight().doubleValue() * ws.getReps();
                }
            }
        }
        Integer avgDuration = sessionWithDuration > 0 ? (int) (totalDuration / sessionWithDuration) : null;
        int currentStreak = computeCurrentStreak(sessions);
        int longestStreak = computeLongestStreak(sessions);
        return new WorkoutSummaryResponse(totalWorkouts, totalSets, Math.round(totalVolume * 10.0) / 10.0, avgDuration, currentStreak, longestStreak);
    }

    private int computeCurrentStreak(List<WorkoutSession> sessions) {
        Set<LocalDate> workoutDates = sessions.stream().map(WorkoutSession::getWorkoutDate).collect(Collectors.toSet());
        int streak = 0;
        LocalDate day = LocalDate.now();
        while (workoutDates.contains(day)) {
            streak++;
            day = day.minusDays(1);
        }
        return streak;
    }

    private int computeLongestStreak(List<WorkoutSession> sessions) {
        List<LocalDate> sortedDates = sessions.stream()
                .map(WorkoutSession::getWorkoutDate)
                .distinct().sorted().toList();
        if (sortedDates.isEmpty()) return 0;
        int longest = 1, current = 1;
        for (int i = 1; i < sortedDates.size(); i++) {
            if (ChronoUnit.DAYS.between(sortedDates.get(i - 1), sortedDates.get(i)) == 1) {
                current++;
                longest = Math.max(longest, current);
            } else {
                current = 1;
            }
        }
        return longest;
    }

    private record PrCandidate(Long exerciseId, String exerciseName,
                               java.math.BigDecimal maxWeight, int reps, LocalDate date) {}
    private record OneRmCandidate(Long exerciseId, String exerciseName, double estimated1RM, LocalDate date) {}
}
