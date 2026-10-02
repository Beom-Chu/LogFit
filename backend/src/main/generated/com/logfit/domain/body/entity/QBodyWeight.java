package com.logfit.domain.body.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QBodyWeight is a Querydsl query type for BodyWeight
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QBodyWeight extends EntityPathBase<BodyWeight> {

    private static final long serialVersionUID = 531865935L;

    public static final QBodyWeight bodyWeight = new QBodyWeight("bodyWeight");

    public final com.logfit.common.QBaseEntity _super = new com.logfit.common.QBaseEntity(this);

    public final NumberPath<Long> bodyWeightId = createNumber("bodyWeightId", Long.class);

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdAt = _super.createdAt;

    public final DatePath<java.time.LocalDate> measureDate = createDate("measureDate", java.time.LocalDate.class);

    //inherited
    public final DateTimePath<java.time.LocalDateTime> modifiedAt = _super.modifiedAt;

    public final NumberPath<Long> userId = createNumber("userId", Long.class);

    public final NumberPath<java.math.BigDecimal> weight = createNumber("weight", java.math.BigDecimal.class);

    public QBodyWeight(String variable) {
        super(BodyWeight.class, forVariable(variable));
    }

    public QBodyWeight(Path<? extends BodyWeight> path) {
        super(path.getType(), path.getMetadata());
    }

    public QBodyWeight(PathMetadata metadata) {
        super(BodyWeight.class, metadata);
    }

}

