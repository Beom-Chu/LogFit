package com.logfit.domain.workout.dto;

import com.logfit.domain.workout.entity.WorkoutSet;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
public class WorkoutSetResponse {
    private final Long setId;
    private final int setOrder;
    private final BigDecimal weight;
    private final int reps;
    private final int durationSeconds;
    private final BigDecimal distanceKm;
    private final boolean completed;

    public WorkoutSetResponse(WorkoutSet set) {
        this.setId = set.getWorkoutSetId();
        this.setOrder = set.getSetOrder();
        this.weight = set.getWeight();
        this.reps = set.getReps();
        this.durationSeconds = set.getDurationSeconds();
        this.distanceKm = set.getDistanceKm();
        this.completed = set.isCompleted();
    }
}
