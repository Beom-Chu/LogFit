package com.logfit.domain.body.dto;

import com.logfit.domain.body.entity.BodyComposition;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
public class BodyCompositionResponse {
    private final Long bodyCompositionId;
    private final BigDecimal weight;
    private final BigDecimal skeletalMuscleMass;
    private final BigDecimal bodyFatPercentage;
    private final LocalDate measureDate;
    private final LocalDateTime createdAt;

    public BodyCompositionResponse(BodyComposition bc) {
        this.bodyCompositionId = bc.getBodyCompositionId();
        this.weight = bc.getWeight();
        this.skeletalMuscleMass = bc.getSkeletalMuscleMass();
        this.bodyFatPercentage = bc.getBodyFatPercentage();
        this.measureDate = bc.getMeasureDate();
        this.createdAt = bc.getCreatedAt();
    }
}
