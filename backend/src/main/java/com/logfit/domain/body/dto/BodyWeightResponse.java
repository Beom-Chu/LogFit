package com.logfit.domain.body.dto;

import com.logfit.domain.body.entity.BodyWeight;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
public class BodyWeightResponse {
    private final Long weightId;
    private final BigDecimal weight;
    private final LocalDate measureDate;
    private final LocalDateTime createdAt;

    public BodyWeightResponse(BodyWeight bw) {
        this.weightId = bw.getBodyWeightId();
        this.weight = bw.getWeight();
        this.measureDate = bw.getMeasureDate();
        this.createdAt = bw.getCreatedAt();
    }
}
