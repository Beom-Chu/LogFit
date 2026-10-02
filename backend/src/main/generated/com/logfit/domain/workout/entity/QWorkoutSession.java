package com.logfit.domain.workout.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QWorkoutSession is a Querydsl query type for WorkoutSession
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QWorkoutSession extends EntityPathBase<WorkoutSession> {

    private static final long serialVersionUID = -246014819L;

    public static final QWorkoutSession workoutSession = new QWorkoutSession("workoutSession");

    public final com.logfit.common.QBaseEntity _super = new com.logfit.common.QBaseEntity(this);

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdAt = _super.createdAt;

    public final DateTimePath<java.time.LocalDateTime> endTime = createDateTime("endTime", java.time.LocalDateTime.class);

    public final StringPath memo = createString("memo");

    //inherited
    public final DateTimePath<java.time.LocalDateTime> modifiedAt = _super.modifiedAt;

    public final NumberPath<Long> sessionId = createNumber("sessionId", Long.class);

    public final DateTimePath<java.time.LocalDateTime> startTime = createDateTime("startTime", java.time.LocalDateTime.class);

    public final EnumPath<WorkoutSessionStatus> status = createEnum("status", WorkoutSessionStatus.class);

    public final NumberPath<Integer> totalDurationMinutes = createNumber("totalDurationMinutes", Integer.class);

    public final NumberPath<Long> userId = createNumber("userId", Long.class);

    public final DatePath<java.time.LocalDate> workoutDate = createDate("workoutDate", java.time.LocalDate.class);

    public final ListPath<WorkoutExercise, QWorkoutExercise> workoutExercises = this.<WorkoutExercise, QWorkoutExercise>createList("workoutExercises", WorkoutExercise.class, QWorkoutExercise.class, PathInits.DIRECT2);

    public QWorkoutSession(String variable) {
        super(WorkoutSession.class, forVariable(variable));
    }

    public QWorkoutSession(Path<? extends WorkoutSession> path) {
        super(path.getType(), path.getMetadata());
    }

    public QWorkoutSession(PathMetadata metadata) {
        super(WorkoutSession.class, metadata);
    }

}

