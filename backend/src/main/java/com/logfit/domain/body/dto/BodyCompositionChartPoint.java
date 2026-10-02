package com.logfit.domain.body.dto;

import com.logfit.domain.body.entity.BodyComposition;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
public class BodyCompositionChartPoint {
    private final LocalDate date;
    private final BigDecimal weight;
    private final BigDecimal skeletalMuscleMass;
    private final BigDecimal bodyFatPercentage;

    public BodyCompositionChartPoint(BodyComposition bc) {
        this.date = bc.getMeasureDate();
        this.weight = bc.getWeight();
        this.skeletalMuscleMass = bc.getSkeletalMuscleMass();
        this.bodyFatPercentage = bc.getBodyFatPercentage();
    }
}
