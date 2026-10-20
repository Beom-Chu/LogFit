-- V7: Record time / distance per set and snapshot the tracking type per logged exercise.
-- Existing rows keep their data: new set columns default to 0 and the snapshot is backfilled
-- from the exercise definition.

ALTER TABLE workout_sets ADD COLUMN IF NOT EXISTS duration_seconds INT NOT NULL DEFAULT 0;
ALTER TABLE workout_sets ADD COLUMN IF NOT EXISTS distance_km DECIMAL(7,2) NOT NULL DEFAULT 0;

ALTER TABLE workout_exercises ADD COLUMN IF NOT EXISTS tracking_type_snapshot VARCHAR(30);

UPDATE workout_exercises we
SET tracking_type_snapshot = e.tracking_type
FROM exercises e
WHERE e.exercise_id = we.exercise_id
  AND we.tracking_type_snapshot IS NULL;

ALTER TABLE workout_exercises ALTER COLUMN tracking_type_snapshot SET DEFAULT 'WEIGHT_REPS';
UPDATE workout_exercises SET tracking_type_snapshot = 'WEIGHT_REPS' WHERE tracking_type_snapshot IS NULL;
ALTER TABLE workout_exercises ALTER COLUMN tracking_type_snapshot SET NOT NULL;
