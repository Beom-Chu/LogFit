-- LogFit Database Schema v1.0
-- PostgreSQL

CREATE TABLE users (
    user_id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    nickname VARCHAR(50) NOT NULL,
    height_cm DECIMAL(5,2),
    gender VARCHAR(20),
    birth_year INT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    modified_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE exercises (
    exercise_id BIGSERIAL PRIMARY KEY,
    owner_user_id BIGINT REFERENCES users(user_id) ON DELETE SET NULL,
    name VARCHAR(100) NOT NULL,
    muscle_group VARCHAR(30) NOT NULL,
    source_type VARCHAR(20) NOT NULL,
    tracking_type VARCHAR(30) NOT NULL DEFAULT 'WEIGHT_REPS',
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    modified_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_exercise_name ON exercises(name);
CREATE INDEX idx_exercise_owner_source ON exercises(owner_user_id, source_type);

CREATE TABLE favorite_exercises (
    favorite_exercise_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    exercise_id BIGINT NOT NULL REFERENCES exercises(exercise_id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    modified_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_favorite UNIQUE (user_id, exercise_id)
);

CREATE TABLE workout_sessions (
    session_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    workout_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PLANNED',
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    total_duration_minutes INT,
    memo TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    modified_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_session_user_date ON workout_sessions(user_id, workout_date);
CREATE INDEX idx_session_user_status ON workout_sessions(user_id, status);

CREATE TABLE workout_exercises (
    workout_exercise_id BIGSERIAL PRIMARY KEY,
    session_id BIGINT NOT NULL REFERENCES workout_sessions(session_id) ON DELETE CASCADE,
    exercise_id BIGINT NOT NULL REFERENCES exercises(exercise_id),
    exercise_name_snapshot VARCHAR(100) NOT NULL,
    muscle_group_snapshot VARCHAR(30) NOT NULL,
    exercise_order INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    modified_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_workout_exercise_session ON workout_exercises(session_id);

CREATE TABLE workout_sets (
    workout_set_id BIGSERIAL PRIMARY KEY,
    workout_exercise_id BIGINT NOT NULL REFERENCES workout_exercises(workout_exercise_id) ON DELETE CASCADE,
    set_order INT NOT NULL,
    weight DECIMAL(6,2) NOT NULL DEFAULT 0,
    reps INT NOT NULL DEFAULT 0,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    modified_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_workout_set_exercise ON workout_sets(workout_exercise_id);

CREATE TABLE body_weights (
    body_weight_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    weight DECIMAL(5,2) NOT NULL,
    measure_date DATE NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    modified_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_body_weight_user_date UNIQUE (user_id, measure_date)
);

CREATE INDEX idx_body_weight_user_date ON body_weights(user_id, measure_date);

CREATE TABLE body_compositions (
    body_composition_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    weight DECIMAL(5,2) NOT NULL,
    skeletal_muscle_mass DECIMAL(5,2) NOT NULL,
    body_fat_percentage DECIMAL(5,2) NOT NULL,
    measure_date DATE NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    modified_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_body_composition_user_date UNIQUE (user_id, measure_date)
);

CREATE INDEX idx_body_composition_user_date ON body_compositions(user_id, measure_date);
