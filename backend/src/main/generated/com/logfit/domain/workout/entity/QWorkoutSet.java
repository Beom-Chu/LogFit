package com.logfit.domain.workout.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QWorkoutSet is a Querydsl query type for WorkoutSet
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QWorkoutSet extends EntityPathBase<WorkoutSet> {

    private static final long serialVersionUID = -512003607L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QWorkoutSet workoutSet = new QWorkoutSet("workoutSet");

    public final com.logfit.common.QBaseEntity _super = new com.logfit.common.QBaseEntity(this);

    public final BooleanPath completed = createBoolean("completed");

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdAt = _super.createdAt;

    //inherited
    public final DateTimePath<java.time.LocalDateTime> modifiedAt = _super.modifiedAt;

    public final NumberPath<Integer> reps = createNumber("reps", Integer.class);

    public final NumberPath<Integer> setOrder = createNumber("setOrder", Integer.class);

    public final NumberPath<java.math.BigDecimal> weight = createNumber("weight", java.math.BigDecimal.class);

    public final QWorkoutExercise workoutExercise;

    public final NumberPath<Long> workoutSetId = createNumber("workoutSetId", Long.class);

    public QWorkoutSet(String variable) {
        this(WorkoutSet.class, forVariable(variable), INITS);
    }

    public QWorkoutSet(Path<? extends WorkoutSet> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QWorkoutSet(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QWorkoutSet(PathMetadata metadata, PathInits inits) {
        this(WorkoutSet.class, metadata, inits);
    }

    public QWorkoutSet(Class<? extends WorkoutSet> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.workoutExercise = inits.isInitialized("workoutExercise") ? new QWorkoutExercise(forProperty("workoutExercise"), inits.get("workoutExercise")) : null;
    }

}

