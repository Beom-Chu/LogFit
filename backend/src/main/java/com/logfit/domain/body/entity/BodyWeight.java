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
@Table(name = "body_weights",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "measure_date"}))
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class BodyWeight extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "body_weight_id")
    private Long bodyWeightId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal weight;

    @Column(nullable = false)
    private LocalDate measureDate;

    @Builder
    public BodyWeight(Long userId, BigDecimal weight, LocalDate measureDate) {
        this.userId = userId;
        this.weight = weight;
        this.measureDate = measureDate;
    }

    public void update(BigDecimal weight) {
        this.weight = weight;
    }
}
