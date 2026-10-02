package com.logfit.domain.body.repository;

import com.logfit.domain.body.entity.BodyWeight;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface BodyWeightRepository extends JpaRepository<BodyWeight, Long> {
    Optional<BodyWeight> findByUserIdAndMeasureDate(Long userId, LocalDate measureDate);
    boolean existsByUserIdAndMeasureDate(Long userId, LocalDate measureDate);

    @Query("SELECT bw FROM BodyWeight bw WHERE bw.userId = :userId ORDER BY bw.measureDate DESC LIMIT 1")
    Optional<BodyWeight> findLatestByUserId(@Param("userId") Long userId);

    List<BodyWeight> findByUserIdOrderByMeasureDateDesc(Long userId);

    @Query("SELECT bw FROM BodyWeight bw WHERE bw.userId = :userId AND bw.measureDate BETWEEN :from AND :to ORDER BY bw.measureDate ASC")
    List<BodyWeight> findChartData(@Param("userId") Long userId, @Param("from") LocalDate from, @Param("to") LocalDate to);
}
