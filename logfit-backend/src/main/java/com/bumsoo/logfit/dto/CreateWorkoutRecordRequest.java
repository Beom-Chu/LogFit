package com.bumsoo.logfit.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record CreateWorkoutRecordRequest(
        @NotNull(message = "운동 종류를 선택해주세요")
        Long exerciseTypeId,

        @NotNull(message = "중량은 필수입니다")
        @DecimalMin(value = "0.0", inclusive = false, message = "중량은 0보다 커야 합니다")
        BigDecimal weightKg,

        @NotNull(message = "횟수는 필수입니다")
        @Min(value = 1, message = "횟수는 1 이상이어야 합니다")
        Integer reps,

        @NotNull(message = "세트 수는 필수입니다")
        @Min(value = 1, message = "세트 수는 1 이상이어야 합니다")
        Integer setCount,

        LocalDateTime performedAt
) {
}

