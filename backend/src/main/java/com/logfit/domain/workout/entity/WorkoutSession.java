package com.logfit.domain.workout.entity;

import com.logfit.common.BaseEntity;
import com.logfit.common.exception.BusinessException;
import com.logfit.common.exception.ErrorCode;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "workout_sessions")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class WorkoutSession extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "session_id")
    private Long sessionId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(nullable = false)
    private LocalDate workoutDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private WorkoutSessionStatus status;

    private LocalDateTime startTime;

    private LocalDateTime endTime;

    private Integer totalDurationMinutes;

    @Column(columnDefinition = "TEXT")
    private String memo;

    @OneToMany(mappedBy = "workoutSession", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("exerciseOrder ASC")
    private List<WorkoutExercise> workoutExercises = new ArrayList<>();

    @Builder
    public WorkoutSession(Long userId, LocalDate workoutDate, WorkoutSessionStatus status, String memo) {
        this.userId = userId;
        this.workoutDate = workoutDate;
        this.status = status != null ? status : WorkoutSessionStatus.PLANNED;
        this.memo = memo;
    }

    public void start() {
        if (this.status != WorkoutSessionStatus.PLANNED) {
            throw new BusinessException(ErrorCode.SESSION_STATUS_INVALID);
        }
        this.status = WorkoutSessionStatus.IN_PROGRESS;
        this.startTime = LocalDateTime.now();
    }

    public void complete() {
        if (this.status != WorkoutSessionStatus.IN_PROGRESS) {
            throw new BusinessException(ErrorCode.SESSION_STATUS_INVALID);
        }
        this.status = WorkoutSessionStatus.COMPLETED;
        this.endTime = LocalDateTime.now();
        if (this.startTime != null) {
            this.totalDurationMinutes = (int) ChronoUnit.MINUTES.between(this.startTime, this.endTime);
        }
    }

    public void updateMemo(String memo) {
        this.memo = memo;
    }

    public String computeDisplayName() {
        if (workoutExercises.isEmpty()) {
            return "운동 없음";
        }
        return workoutExercises.stream()
                .map(we -> we.getMuscleGroupSnapshot().name())
                .distinct()
                .limit(2)
                .reduce((a, b) -> a + " / " + b)
                .orElse("운동");
    }
}
