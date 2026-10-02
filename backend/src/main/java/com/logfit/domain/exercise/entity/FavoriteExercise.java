package com.logfit.domain.exercise.entity;

import com.logfit.common.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "favorite_exercises",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "exercise_id"}))
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class FavoriteExercise extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "favorite_exercise_id")
    private Long favoriteExerciseId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "exercise_id", nullable = false)
    private Long exerciseId;

    @Builder
    public FavoriteExercise(Long userId, Long exerciseId) {
        this.userId = userId;
        this.exerciseId = exerciseId;
    }
}
