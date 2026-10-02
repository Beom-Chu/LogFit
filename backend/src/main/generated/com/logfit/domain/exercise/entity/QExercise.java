package com.logfit.domain.exercise.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QExercise is a Querydsl query type for Exercise
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QExercise extends EntityPathBase<Exercise> {

    private static final long serialVersionUID = -1848271133L;

    public static final QExercise exercise = new QExercise("exercise");

    public final com.logfit.common.QBaseEntity _super = new com.logfit.common.QBaseEntity(this);

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdAt = _super.createdAt;

    public final NumberPath<Long> exerciseId = createNumber("exerciseId", Long.class);

    public final BooleanPath isDeleted = createBoolean("isDeleted");

    //inherited
    public final DateTimePath<java.time.LocalDateTime> modifiedAt = _super.modifiedAt;

    public final EnumPath<MuscleGroup> muscleGroup = createEnum("muscleGroup", MuscleGroup.class);

    public final StringPath name = createString("name");

    public final NumberPath<Long> ownerUserId = createNumber("ownerUserId", Long.class);

    public final EnumPath<ExerciseSourceType> sourceType = createEnum("sourceType", ExerciseSourceType.class);

    public final EnumPath<TrackingType> trackingType = createEnum("trackingType", TrackingType.class);

    public QExercise(String variable) {
        super(Exercise.class, forVariable(variable));
    }

    public QExercise(Path<? extends Exercise> path) {
        super(path.getType(), path.getMetadata());
    }

    public QExercise(PathMetadata metadata) {
        super(Exercise.class, metadata);
    }

}

