package com.logfit.domain.history.dto;

import com.logfit.domain.workout.entity.WorkoutExercise;
import com.logfit.domain.workout.entity.WorkoutSession;
import com.logfit.domain.workout.entity.WorkoutSet;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Getter
public class WorkoutHistoryDetailResponse {
    private final Long sessionId;
    private final LocalDate workoutDate;
    private final String displayName;
    private final Integer durationMinutes;
    private final String memo;
    private final List<ExerciseDetail> exercises;

    public WorkoutHistoryDetailResponse(WorkoutSession session) {
        this.sessionId = session.getSessionId();
        this.workoutDate = session.getWorkoutDate();
        this.displayName = session.computeDisplayName();
        this.durationMinutes = session.getTotalDurationMinutes();
        this.memo = session.getMemo();
        this.exercises = session.getWorkoutExercises().stream()
                .map(ExerciseDetail::new).toList();
    }

    @Getter
    public static class ExerciseDetail {
        private final Long workoutExerciseId;
        private final String exerciseName;
        private final List<SetDetail> sets;

        public ExerciseDetail(WorkoutExercise we) {
            this.workoutExerciseId = we.getWorkoutExerciseId();
            this.exerciseName = we.getExerciseNameSnapshot();
            this.sets = we.getWorkoutSets().stream().map(SetDetail::new).toList();
        }
    }

    @Getter
    public static class SetDetail {
        private final int setOrder;
        private final BigDecimal weight;
        private final int reps;
        private final boolean completed;

        public SetDetail(WorkoutSet ws) {
            this.setOrder = ws.getSetOrder();
            this.weight = ws.getWeight();
            this.reps = ws.getReps();
            this.completed = ws.isCompleted();
        }
    }
}
