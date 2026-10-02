package com.logfit.domain.body.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
public class BodyWeightRequest {

    @NotNull
    @DecimalMin("0.0")
    @DecimalMax("500.0")
    private BigDecimal weight;

    @NotNull
    private LocalDate measureDate;
}
