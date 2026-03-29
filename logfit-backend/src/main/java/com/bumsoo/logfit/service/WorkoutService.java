package com.bumsoo.logfit.service;

import com.bumsoo.logfit.dto.CreateWorkoutRecordRequest;
import com.bumsoo.logfit.dto.WeeklyWorkoutSummaryResponse;
import com.bumsoo.logfit.dto.WorkoutRecordResponse;
import com.bumsoo.logfit.entity.ExerciseType;
import com.bumsoo.logfit.entity.User;
import com.bumsoo.logfit.entity.WorkoutRecord;
import com.bumsoo.logfit.repository.WorkoutRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class WorkoutService {

    private final WorkoutRecordRepository workoutRecordRepository;
    private final ExerciseTypeService exerciseTypeService;

    public WorkoutRecordResponse createRecord(User user, CreateWorkoutRecordRequest request) {
        ExerciseType exerciseType = exerciseTypeService.resolveExerciseTypeForUser(user, request.exerciseTypeId());

        WorkoutRecord record = WorkoutRecord.builder()
                .user(user)
                .exerciseType(exerciseType)
                .weightKg(request.weightKg())
                .reps(request.reps())
                .setCount(request.setCount())
                .performedAt(request.performedAt())
                .build();

        return WorkoutRecordResponse.from(workoutRecordRepository.save(record));
    }

    @Transactional(readOnly = true)
    public List<WorkoutRecordResponse> getMyRecords(User user) {
        return workoutRecordRepository.findByUserIdOrderByPerformedAtDesc(user.getId()).stream()
                .map(WorkoutRecordResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public WeeklyWorkoutSummaryResponse getWeeklySummary(User user) {
        LocalDate monday = LocalDate.now().with(DayOfWeek.MONDAY);
        LocalDateTime weekStart = monday.atStartOfDay();

        List<WorkoutRecord> weeklyRecords = workoutRecordRepository
                .findByUserIdAndPerformedAtGreaterThanEqualOrderByPerformedAtDesc(user.getId(), weekStart);

        BigDecimal totalVolume = weeklyRecords.stream()
                .map(record -> record.getWeightKg()
                        .multiply(BigDecimal.valueOf(record.getReps()))
                        .multiply(BigDecimal.valueOf(record.getSetCount())))
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .setScale(2, RoundingMode.HALF_UP);

        int activeDays = (int) weeklyRecords.stream()
                .map(record -> record.getPerformedAt().toLocalDate())
                .distinct()
                .count();

        return new WeeklyWorkoutSummaryResponse(
                weeklyRecords.size(),
                totalVolume,
                activeDays
        );
    }

    public WorkoutRecordResponse updateRecord(User user, Long recordId, CreateWorkoutRecordRequest request) {
        WorkoutRecord record = workoutRecordRepository.findByIdAndUserId(recordId, user.getId())
                .orElseThrow(() -> new IllegalArgumentException("수정할 운동 기록이 없습니다"));

        ExerciseType exerciseType = exerciseTypeService.resolveExerciseTypeForUser(user, request.exerciseTypeId());

        record.setExerciseType(exerciseType);
        record.setWeightKg(request.weightKg());
        record.setReps(request.reps());
        record.setSetCount(request.setCount());
        if (request.performedAt() != null) {
            record.setPerformedAt(request.performedAt());
        }

        return WorkoutRecordResponse.from(workoutRecordRepository.save(record));
    }

    public void deleteRecord(User user, Long recordId) {
        WorkoutRecord record = workoutRecordRepository.findByIdAndUserId(recordId, user.getId())
                .orElseThrow(() -> new IllegalArgumentException("삭제할 운동 기록이 없습니다"));
        workoutRecordRepository.delete(record);
    }
}
