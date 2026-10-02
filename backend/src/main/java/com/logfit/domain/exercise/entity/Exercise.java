package com.logfit.domain.exercise.entity;

import com.logfit.common.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "exercises")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Exercise extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "exercise_id")
    private Long exerciseId;

    @Column(name = "owner_user_id")
    private Long ownerUserId;

    @Column(nullable = false, length = 100)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private MuscleGroup muscleGroup;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ExerciseSourceType sourceType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private TrackingType trackingType;

    @Column(nullable = false)
    private boolean isDeleted = false;

    @Builder
    public Exercise(Long ownerUserId, String name, MuscleGroup muscleGroup,
                    ExerciseSourceType sourceType, TrackingType trackingType) {
        this.ownerUserId = ownerUserId;
        this.name = name;
        this.muscleGroup = muscleGroup;
        this.sourceType = sourceType;
        this.trackingType = trackingType;
    }

    public void update(String name, MuscleGroup muscleGroup, TrackingType trackingType) {
        this.name = name;
        this.muscleGroup = muscleGroup;
        this.trackingType = trackingType;
    }

    public void delete() {
        this.isDeleted = true;
    }

    public boolean isSystem() {
        return this.sourceType == ExerciseSourceType.SYSTEM;
    }

    public boolean isOwnedBy(Long userId) {
        return userId.equals(this.ownerUserId);
    }
}
