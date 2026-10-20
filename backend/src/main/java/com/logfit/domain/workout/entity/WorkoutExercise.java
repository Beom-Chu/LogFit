package com.logfit.domain.workout.entity;

import com.logfit.common.BaseEntity;
import com.logfit.domain.exercise.entity.Exercise;
import com.logfit.domain.exercise.entity.MuscleGroup;
import com.logfit.domain.exercise.entity.TrackingType;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "workout_exercises")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class WorkoutExercise extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "workout_exercise_id")
    private Long workoutExerciseId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    private WorkoutSession workoutSession;

    @Column(name = "exercise_id", nullable = false)
    private Long exerciseId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exercise_id", insertable = false, updatable = false)
    private Exercise exercise;

    @Column(nullable = false, length = 100)
    private String exerciseNameSnapshot;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private MuscleGroup muscleGroupSnapshot;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private TrackingType trackingTypeSnapshot;

    @Column(nullable = false)
    private int exerciseOrder;

    @OneToMany(mappedBy = "workoutExercise", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("setOrder ASC")
    private List<WorkoutSet> workoutSets = new ArrayList<>();

    @Builder
    public WorkoutExercise(WorkoutSession workoutSession, Exercise exercise, int exerciseOrder) {
        this.workoutSession = workoutSession;
        this.exercise = exercise;
        this.exerciseId = exercise.getExerciseId();
        this.exerciseNameSnapshot = exercise.getName();
        this.muscleGroupSnapshot = exercise.getMuscleGroup();
        this.trackingTypeSnapshot = exercise.getTrackingType();
        this.exerciseOrder = exerciseOrder;
    }
}
