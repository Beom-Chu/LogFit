package com.bumsoo.logfit.dto;

import com.bumsoo.logfit.entity.ExerciseType;

public record ExerciseTypeResponse(
        Long id,
        String name,
        boolean isDefault,
        Long createdByUserId
) {
    public static ExerciseTypeResponse from(ExerciseType exerciseType) {
        return new ExerciseTypeResponse(
                exerciseType.getId(),
                exerciseType.getName(),
                Boolean.TRUE.equals(exerciseType.getIsDefault()),
                exerciseType.getCreatedBy() == null ? null : exerciseType.getCreatedBy().getId()
        );
    }
}

