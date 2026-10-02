package com.logfit.domain.workout.dto;

import com.logfit.domain.workout.entity.WorkoutSession;
import com.logfit.domain.workout.entity.WorkoutSessionStatus;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
public class WorkoutSessionResponse {
    private final Long sessionId;
    private final LocalDate workoutDate;
    private final WorkoutSessionStatus status;
    private final LocalDateTime startTime;
    private final LocalDateTime endTime;
    private final Integer totalDurationMinutes;
    private final String memo;
    private final String displayName;
    private final List<WorkoutExerciseResponse> exercises;

    public WorkoutSessionResponse(WorkoutSession session) {
        this.sessionId = session.getSessionId();
        this.workoutDate = session.getWorkoutDate();
        this.status = session.getStatus();
        this.startTime = session.getStartTime();
        this.endTime = session.getEndTime();
        this.totalDurationMinutes = session.getTotalDurationMinutes();
        this.memo = session.getMemo();
        this.displayName = session.computeDisplayName();
        this.exercises = session.getWorkoutExercises().stream()
                .map(WorkoutExerciseResponse::new).toList();
    }
}
