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
    private final boolean completed;

    public WorkoutSetResponse(WorkoutSet set) {
        this.setId = set.getWorkoutSetId();
        this.setOrder = set.getSetOrder();
        this.weight = set.getWeight();
        this.reps = set.getReps();
        this.completed = set.isCompleted();
    }
}
