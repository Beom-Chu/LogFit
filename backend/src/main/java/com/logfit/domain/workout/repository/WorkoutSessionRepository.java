package com.logfit.domain.workout.repository;

import com.logfit.domain.workout.entity.WorkoutSession;
import com.logfit.domain.workout.entity.WorkoutSessionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface WorkoutSessionRepository extends JpaRepository<WorkoutSession, Long> {

    List<WorkoutSession> findByUserIdAndStatus(Long userId, WorkoutSessionStatus status);

    List<WorkoutSession> findByUserIdAndWorkoutDateBetween(Long userId, LocalDate from, LocalDate to);

    @Query("SELECT s FROM WorkoutSession s WHERE s.userId = :userId AND s.status = 'COMPLETED' ORDER BY s.workoutDate DESC")
    List<WorkoutSession> findCompletedByUserId(@Param("userId") Long userId);

    @Query("SELECT s FROM WorkoutSession s WHERE s.userId = :userId AND s.status = 'IN_PROGRESS'")
    Optional<WorkoutSession> findInProgressByUserId(@Param("userId") Long userId);

    @Query("SELECT s FROM WorkoutSession s WHERE s.userId = :userId AND s.status = 'PLANNED' AND s.workoutDate >= :today ORDER BY s.workoutDate ASC")
    Optional<WorkoutSession> findNearestPlannedByUserId(@Param("userId") Long userId, @Param("today") LocalDate today);

    @Query("SELECT s FROM WorkoutSession s WHERE s.userId = :userId AND s.status = 'COMPLETED' ORDER BY s.workoutDate DESC LIMIT 1")
    Optional<WorkoutSession> findLatestCompletedByUserId(@Param("userId") Long userId);
}
