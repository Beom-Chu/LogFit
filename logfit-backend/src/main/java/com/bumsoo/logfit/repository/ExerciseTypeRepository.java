package com.bumsoo.logfit.repository;

import com.bumsoo.logfit.entity.ExerciseType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ExerciseTypeRepository extends JpaRepository<ExerciseType, Long> {

    @Query("select e from ExerciseType e where e.isDefault = true or e.createdBy.id = :userId order by e.name asc")
    List<ExerciseType> findAvailableByUserId(@Param("userId") Long userId);

    boolean existsByCreatedByIdAndNameIgnoreCase(Long userId, String name);

    boolean existsByIsDefaultTrueAndNameIgnoreCase(String name);

    Optional<ExerciseType> findByIdAndCreatedById(Long id, Long userId);
}


