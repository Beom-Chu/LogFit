package com.bumsoo.logfit.repository;

import com.bumsoo.logfit.entity.WorkoutRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface WorkoutRecordRepository extends JpaRepository<WorkoutRecord, Long> {

    List<WorkoutRecord> findByUserIdOrderByPerformedAtDesc(Long userId);

    List<WorkoutRecord> findByUserIdAndPerformedAtGreaterThanEqualOrderByPerformedAtDesc(Long userId, LocalDateTime startDateTime);

    Optional<WorkoutRecord> findByIdAndUserId(Long id, Long userId);
}
