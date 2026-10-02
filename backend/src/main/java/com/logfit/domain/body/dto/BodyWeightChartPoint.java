package com.logfit.domain.body.dto;

import com.logfit.domain.body.entity.BodyWeight;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
public class BodyWeightChartPoint {
    private final LocalDate date;
    private final BigDecimal weight;

    public BodyWeightChartPoint(BodyWeight bw) {
        this.date = bw.getMeasureDate();
        this.weight = bw.getWeight();
    }
}
