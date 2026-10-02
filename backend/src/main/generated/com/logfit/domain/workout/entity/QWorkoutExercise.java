package com.logfit.domain.workout.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QWorkoutExercise is a Querydsl query type for WorkoutExercise
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QWorkoutExercise extends EntityPathBase<WorkoutExercise> {

    private static final long serialVersionUID = 1614719153L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QWorkoutExercise workoutExercise = new QWorkoutExercise("workoutExercise");

    public final com.logfit.common.QBaseEntity _super = new com.logfit.common.QBaseEntity(this);

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdAt = _super.createdAt;

    public final NumberPath<Long> exerciseId = createNumber("exerciseId", Long.class);

    public final StringPath exerciseNameSnapshot = createString("exerciseNameSnapshot");

    public final NumberPath<Integer> exerciseOrder = createNumber("exerciseOrder", Integer.class);

    //inherited
    public final DateTimePath<java.time.LocalDateTime> modifiedAt = _super.modifiedAt;

    public final EnumPath<com.logfit.domain.exercise.entity.MuscleGroup> muscleGroupSnapshot = createEnum("muscleGroupSnapshot", com.logfit.domain.exercise.entity.MuscleGroup.class);

    public final NumberPath<Long> workoutExerciseId = createNumber("workoutExerciseId", Long.class);

    public final QWorkoutSession workoutSession;

    public final ListPath<WorkoutSet, QWorkoutSet> workoutSets = this.<WorkoutSet, QWorkoutSet>createList("workoutSets", WorkoutSet.class, QWorkoutSet.class, PathInits.DIRECT2);

    public QWorkoutExercise(String variable) {
        this(WorkoutExercise.class, forVariable(variable), INITS);
    }

    public QWorkoutExercise(Path<? extends WorkoutExercise> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QWorkoutExercise(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QWorkoutExercise(PathMetadata metadata, PathInits inits) {
        this(WorkoutExercise.class, metadata, inits);
    }

    public QWorkoutExercise(Class<? extends WorkoutExercise> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.workoutSession = inits.isInitialized("workoutSession") ? new QWorkoutSession(forProperty("workoutSession")) : null;
    }

}

