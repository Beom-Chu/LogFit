package com.logfit.domain.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
public class UpdateProfileRequest {
    @NotBlank @Size(max = 50)
    private String nickname;
    private BigDecimal heightCm;
    private String gender;
    private Integer birthYear;
}
