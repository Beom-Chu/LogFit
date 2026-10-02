package com.logfit.domain.body.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
public class BodyCompositionRequest {

    @NotNull
    @DecimalMin("0.0")
    @DecimalMax("500.0")
    private BigDecimal weight;

    @NotNull
    @DecimalMin("0.0")
    @DecimalMax("100.0")
    private BigDecimal skeletalMuscleMass;

    @NotNull
    @DecimalMin("0.0")
    @DecimalMax("100.0")
    private BigDecimal bodyFatPercentage;

    @NotNull
    private LocalDate measureDate;
}
