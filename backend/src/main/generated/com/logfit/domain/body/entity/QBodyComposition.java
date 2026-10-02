package com.logfit.domain.body.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QBodyComposition is a Querydsl query type for BodyComposition
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QBodyComposition extends EntityPathBase<BodyComposition> {

    private static final long serialVersionUID = 1388927283L;

    public static final QBodyComposition bodyComposition = new QBodyComposition("bodyComposition");

    public final com.logfit.common.QBaseEntity _super = new com.logfit.common.QBaseEntity(this);

    public final NumberPath<Long> bodyCompositionId = createNumber("bodyCompositionId", Long.class);

    public final NumberPath<java.math.BigDecimal> bodyFatPercentage = createNumber("bodyFatPercentage", java.math.BigDecimal.class);

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdAt = _super.createdAt;

    public final DatePath<java.time.LocalDate> measureDate = createDate("measureDate", java.time.LocalDate.class);

    //inherited
    public final DateTimePath<java.time.LocalDateTime> modifiedAt = _super.modifiedAt;

    public final NumberPath<java.math.BigDecimal> skeletalMuscleMass = createNumber("skeletalMuscleMass", java.math.BigDecimal.class);

    public final NumberPath<Long> userId = createNumber("userId", Long.class);

    public final NumberPath<java.math.BigDecimal> weight = createNumber("weight", java.math.BigDecimal.class);

    public QBodyComposition(String variable) {
        super(BodyComposition.class, forVariable(variable));
    }

    public QBodyComposition(Path<? extends BodyComposition> path) {
        super(path.getType(), path.getMetadata());
    }

    public QBodyComposition(PathMetadata metadata) {
        super(BodyComposition.class, metadata);
    }

}

