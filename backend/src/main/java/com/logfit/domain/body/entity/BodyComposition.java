package com.logfit.domain.body.entity;

import com.logfit.common.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "body_compositions",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "measure_date"}))
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class BodyComposition extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "body_composition_id")
    private Long bodyCompositionId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal weight;

    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal skeletalMuscleMass;

    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal bodyFatPercentage;

    @Column(nullable = false)
    private LocalDate measureDate;

    @Builder
    public BodyComposition(Long userId, BigDecimal weight, BigDecimal skeletalMuscleMass,
                           BigDecimal bodyFatPercentage, LocalDate measureDate) {
        this.userId = userId;
        this.weight = weight;
        this.skeletalMuscleMass = skeletalMuscleMass;
        this.bodyFatPercentage = bodyFatPercentage;
        this.measureDate = measureDate;
    }

    public void update(BigDecimal weight, BigDecimal skeletalMuscleMass, BigDecimal bodyFatPercentage) {
        this.weight = weight;
        this.skeletalMuscleMass = skeletalMuscleMass;
        this.bodyFatPercentage = bodyFatPercentage;
    }
}
