package com.logfit.domain.workout.dto;

import com.logfit.domain.workout.entity.WorkoutSession;
import com.logfit.domain.workout.entity.WorkoutSessionStatus;
import lombok.Getter;

import java.time.LocalDate;

@Getter
public class WorkoutSessionSummary {
    private final Long sessionId;
    private final LocalDate workoutDate;
    private final WorkoutSessionStatus status;
    private final String displayName;
    private final Integer totalDurationMinutes;

    public WorkoutSessionSummary(WorkoutSession session) {
        this.sessionId = session.getSessionId();
        this.workoutDate = session.getWorkoutDate();
        this.status = session.getStatus();
        this.displayName = session.computeDisplayName();
        this.totalDurationMinutes = session.getTotalDurationMinutes();
    }
}
