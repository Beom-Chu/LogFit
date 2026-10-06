-- V3: Add image_url and stable_key to exercises
-- stable_key: idempotent seed identifier for SYSTEM exercises
-- image_url:  relative path to local static asset (e.g. /images/exercises/xxx.webp)

ALTER TABLE exercises ADD COLUMN IF NOT EXISTS image_url VARCHAR(255);
ALTER TABLE exercises ADD COLUMN IF NOT EXISTS stable_key VARCHAR(100);

CREATE UNIQUE INDEX IF NOT EXISTS idx_exercise_stable_key
    ON exercises(stable_key)
    WHERE stable_key IS NOT NULL;
