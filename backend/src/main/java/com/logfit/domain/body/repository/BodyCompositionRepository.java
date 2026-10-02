package com.logfit.domain.body.repository;

import com.logfit.domain.body.entity.BodyComposition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface BodyCompositionRepository extends JpaRepository<BodyComposition, Long> {
    Optional<BodyComposition> findByUserIdAndMeasureDate(Long userId, LocalDate measureDate);
    boolean existsByUserIdAndMeasureDate(Long userId, LocalDate measureDate);

    @Query("SELECT bc FROM BodyComposition bc WHERE bc.userId = :userId ORDER BY bc.measureDate DESC LIMIT 1")
    Optional<BodyComposition> findLatestByUserId(@Param("userId") Long userId);

    List<BodyComposition> findByUserIdOrderByMeasureDateDesc(Long userId);

    @Query("SELECT bc FROM BodyComposition bc WHERE bc.userId = :userId AND bc.measureDate BETWEEN :from AND :to ORDER BY bc.measureDate ASC")
    List<BodyComposition> findChartData(@Param("userId") Long userId, @Param("from") LocalDate from, @Param("to") LocalDate to);
}
