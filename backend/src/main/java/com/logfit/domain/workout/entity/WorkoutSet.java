package com.logfit.domain.workout.entity;

import com.logfit.common.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "workout_sets")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class WorkoutSet extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "workout_set_id")
    private Long workoutSetId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workout_exercise_id", nullable = false)
    private WorkoutExercise workoutExercise;

    @Column(nullable = false)
    private int setOrder;

    @Column(precision = 6, scale = 2, nullable = false)
    private BigDecimal weight;

    @Column(nullable = false)
    private int reps;

    @Column(nullable = false)
    private boolean completed;

    @Builder
    public WorkoutSet(WorkoutExercise workoutExercise, int setOrder, BigDecimal weight, int reps) {
        this.workoutExercise = workoutExercise;
        this.setOrder = setOrder;
        this.weight = weight != null ? weight : BigDecimal.ZERO;
        this.reps = reps;
        this.completed = false;
    }

    public void update(BigDecimal weight, int reps) {
        this.weight = weight != null ? weight : BigDecimal.ZERO;
        this.reps = reps;
    }

    public void toggleComplete() {
        this.completed = !this.completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }

    public double calculate1RM() {
        if (reps == 0) return weight.doubleValue();
        return weight.doubleValue() * (1 + reps / 30.0);
    }
}
