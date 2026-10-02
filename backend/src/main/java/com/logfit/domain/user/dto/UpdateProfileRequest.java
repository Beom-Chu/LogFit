package com.logfit.domain.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;

@Getter
public class UpdateProfileRequest {
    @NotBlank @Size(max = 50)
    private String nickname;
    private Double heightCm;
    private String gender;
    private Integer birthYear;
}
