-- V6: Reuse pre-existing default exercises instead of keeping V4 duplicates.
-- A V4 row is merged into an older SYSTEM row only when the names are identical after
-- ignoring spaces and the 푸쉬/푸시 spelling (same equipment and variation).
-- Workout history and favorites are repointed to the older row; the older row receives the
-- stable_key / image / muscle group / tracking type / canonical name of the V4 row.
-- Re-running is a no-op: merged old rows already carry a stable_key.

DO $$
DECLARE
    r RECORD;
    n RECORD;
BEGIN
    FOR r IN
        SELECT ne.exercise_id AS new_id, oe.exercise_id AS old_id
        FROM exercises ne
        JOIN LATERAL (
            SELECT o.exercise_id
            FROM exercises o
            WHERE o.stable_key IS NULL
              AND o.owner_user_id IS NULL
              AND o.source_type = 'SYSTEM'
              AND o.is_deleted = FALSE
              AND regexp_replace(replace(o.name, '푸쉬', '푸시'), '\s+', '', 'g')
                = regexp_replace(replace(ne.name, '푸쉬', '푸시'), '\s+', '', 'g')
            ORDER BY o.exercise_id
            LIMIT 1
        ) oe ON TRUE
        WHERE ne.stable_key IS NOT NULL
          AND ne.owner_user_id IS NULL
          AND ne.source_type = 'SYSTEM'
    LOOP
        UPDATE workout_exercises SET exercise_id = r.old_id WHERE exercise_id = r.new_id;

        DELETE FROM favorite_exercises f
        WHERE f.exercise_id = r.new_id
          AND EXISTS (SELECT 1 FROM favorite_exercises g
                      WHERE g.user_id = f.user_id AND g.exercise_id = r.old_id);
        UPDATE favorite_exercises SET exercise_id = r.old_id WHERE exercise_id = r.new_id;

        SELECT stable_key, name, muscle_group, tracking_type, image_url INTO n
        FROM exercises WHERE exercise_id = r.new_id;

        DELETE FROM exercises WHERE exercise_id = r.new_id;

        UPDATE exercises
        SET stable_key    = n.stable_key,
            name          = n.name,
            muscle_group  = n.muscle_group,
            tracking_type = n.tracking_type,
            image_url     = n.image_url,
            modified_at   = NOW()
        WHERE exercise_id = r.old_id;
    END LOOP;
END $$;

-- 하체 10종 (LEG 9 + GLUTE 1) / 등 9종: conventional deadlift belongs to the lower-body group of the list.
UPDATE exercises SET muscle_group = 'LEG' WHERE stable_key = 'barbell-deadlift' AND muscle_group <> 'LEG';
