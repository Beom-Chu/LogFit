package com.logfit.domain.statistics.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@AllArgsConstructor
public class VolumePoint {
    private final LocalDate date;
    private final double totalVolume;
}
