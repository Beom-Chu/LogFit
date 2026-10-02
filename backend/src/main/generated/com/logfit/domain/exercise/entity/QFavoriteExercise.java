package com.logfit.domain.exercise.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QFavoriteExercise is a Querydsl query type for FavoriteExercise
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QFavoriteExercise extends EntityPathBase<FavoriteExercise> {

    private static final long serialVersionUID = -1959774817L;

    public static final QFavoriteExercise favoriteExercise = new QFavoriteExercise("favoriteExercise");

    public final com.logfit.common.QBaseEntity _super = new com.logfit.common.QBaseEntity(this);

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdAt = _super.createdAt;

    public final NumberPath<Long> exerciseId = createNumber("exerciseId", Long.class);

    public final NumberPath<Long> favoriteExerciseId = createNumber("favoriteExerciseId", Long.class);

    //inherited
    public final DateTimePath<java.time.LocalDateTime> modifiedAt = _super.modifiedAt;

    public final NumberPath<Long> userId = createNumber("userId", Long.class);

    public QFavoriteExercise(String variable) {
        super(FavoriteExercise.class, forVariable(variable));
    }

    public QFavoriteExercise(Path<? extends FavoriteExercise> path) {
        super(path.getType(), path.getMetadata());
    }

    public QFavoriteExercise(PathMetadata metadata) {
        super(FavoriteExercise.class, metadata);
    }

}

