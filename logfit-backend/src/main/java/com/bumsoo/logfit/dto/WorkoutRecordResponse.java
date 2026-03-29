package com.bumsoo.logfit.dto;

import com.bumsoo.logfit.entity.WorkoutRecord;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record WorkoutRecordResponse(
        Long id,
        Long exerciseTypeId,
        String exerciseName,
        BigDecimal weightKg,
        Integer reps,
        Integer setCount,
        LocalDateTime performedAt
) {
    public static WorkoutRecordResponse from(WorkoutRecord record) {
        return new WorkoutRecordResponse(
                record.getId(),
                record.getExerciseType().getId(),
                record.getExerciseType().getName(),
                record.getWeightKg(),
                record.getReps(),
                record.getSetCount(),
                record.getPerformedAt()
        );
    }
}

