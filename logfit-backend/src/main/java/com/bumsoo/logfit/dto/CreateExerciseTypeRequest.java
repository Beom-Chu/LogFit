package com.bumsoo.logfit.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateExerciseTypeRequest(
        @NotBlank(message = "운동 종류 이름은 필수입니다")
        @Size(max = 100, message = "운동 종류 이름은 100자 이하여야 합니다")
        String name
) {
}

