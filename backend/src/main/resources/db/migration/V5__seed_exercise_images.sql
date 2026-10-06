-- V5: Set image_url for the 60 seeded exercises (idempotent)
-- Paths are relative to the frontend static assets root.
-- 6 exercises intentionally have no image (NULL): machine-row, reverse-pec-deck,
-- cable-rope-tricep-pushdown, cable-overhead-tricep-ext, dips-tricep, treadmill-walk.
-- ─────────────────────────────────────────────────────────────────────────────
-- Image credits:
--   RepDB (repdb.co) – 53 images, license: https://github.com/RepDB/exercise-dataset/blob/main/LICENSE-DATA.md
--   Wikimedia Commons CC0 – 1 image (outdoor-cycling), https://commons.wikimedia.org/wiki/File:Man_cycling_at_sunset.jpg
-- ─────────────────────────────────────────────────────────────────────────────

-- CHEST
UPDATE exercises SET image_url = '/images/exercises/barbell-bench-press.webp'      WHERE stable_key = 'barbell-bench-press';
UPDATE exercises SET image_url = '/images/exercises/db-bench-press.webp'           WHERE stable_key = 'db-bench-press';
UPDATE exercises SET image_url = '/images/exercises/incline-bench-press-bb.webp'   WHERE stable_key = 'incline-bench-press-bb';
UPDATE exercises SET image_url = '/images/exercises/incline-bench-press-db.webp'   WHERE stable_key = 'incline-bench-press-db';
UPDATE exercises SET image_url = '/images/exercises/machine-chest-press.webp'      WHERE stable_key = 'machine-chest-press';
UPDATE exercises SET image_url = '/images/exercises/smith-bench-press.webp'        WHERE stable_key = 'smith-bench-press';
UPDATE exercises SET image_url = '/images/exercises/pec-deck.webp'                 WHERE stable_key = 'pec-deck';
UPDATE exercises SET image_url = '/images/exercises/cable-fly.webp'                WHERE stable_key = 'cable-fly';
UPDATE exercises SET image_url = '/images/exercises/push-up.webp'                  WHERE stable_key = 'push-up';

-- BACK
UPDATE exercises SET image_url = '/images/exercises/pull-up.webp'                  WHERE stable_key = 'pull-up';
UPDATE exercises SET image_url = '/images/exercises/assisted-pull-up.webp'         WHERE stable_key = 'assisted-pull-up';
UPDATE exercises SET image_url = '/images/exercises/lat-pulldown.webp'             WHERE stable_key = 'lat-pulldown';
UPDATE exercises SET image_url = '/images/exercises/barbell-row.webp'              WHERE stable_key = 'barbell-row';
UPDATE exercises SET image_url = '/images/exercises/single-arm-db-row.webp'        WHERE stable_key = 'single-arm-db-row';
UPDATE exercises SET image_url = '/images/exercises/seated-cable-row.webp'         WHERE stable_key = 'seated-cable-row';
-- machine-row: no image (placeholder)
UPDATE exercises SET image_url = '/images/exercises/straight-arm-pulldown.webp'    WHERE stable_key = 'straight-arm-pulldown';
UPDATE exercises SET image_url = '/images/exercises/back-extension-bw.webp'        WHERE stable_key = 'back-extension-bw';

-- SHOULDER
UPDATE exercises SET image_url = '/images/exercises/barbell-ohp.webp'              WHERE stable_key = 'barbell-ohp';
UPDATE exercises SET image_url = '/images/exercises/seated-db-press.webp'          WHERE stable_key = 'seated-db-press';
UPDATE exercises SET image_url = '/images/exercises/machine-shoulder-press.webp'   WHERE stable_key = 'machine-shoulder-press';
UPDATE exercises SET image_url = '/images/exercises/db-lateral-raise.webp'         WHERE stable_key = 'db-lateral-raise';
UPDATE exercises SET image_url = '/images/exercises/cable-lateral-raise.webp'      WHERE stable_key = 'cable-lateral-raise';
UPDATE exercises SET image_url = '/images/exercises/rear-delt-fly-db.webp'         WHERE stable_key = 'rear-delt-fly-db';
-- reverse-pec-deck: no image (placeholder)
UPDATE exercises SET image_url = '/images/exercises/cable-face-pull.webp'          WHERE stable_key = 'cable-face-pull';

-- LEG / GLUTE
UPDATE exercises SET image_url = '/images/exercises/barbell-back-squat.webp'       WHERE stable_key = 'barbell-back-squat';
UPDATE exercises SET image_url = '/images/exercises/barbell-deadlift.webp'         WHERE stable_key = 'barbell-deadlift';
UPDATE exercises SET image_url = '/images/exercises/barbell-rdl.webp'              WHERE stable_key = 'barbell-rdl';
UPDATE exercises SET image_url = '/images/exercises/leg-press.webp'                WHERE stable_key = 'leg-press';
UPDATE exercises SET image_url = '/images/exercises/leg-extension.webp'            WHERE stable_key = 'leg-extension';
UPDATE exercises SET image_url = '/images/exercises/seated-leg-curl.webp'          WHERE stable_key = 'seated-leg-curl';
UPDATE exercises SET image_url = '/images/exercises/barbell-hip-thrust.webp'       WHERE stable_key = 'barbell-hip-thrust';
UPDATE exercises SET image_url = '/images/exercises/db-lunge.webp'                 WHERE stable_key = 'db-lunge';
UPDATE exercises SET image_url = '/images/exercises/bulgarian-split-squat.webp'    WHERE stable_key = 'bulgarian-split-squat';
UPDATE exercises SET image_url = '/images/exercises/machine-calf-raise.webp'       WHERE stable_key = 'machine-calf-raise';

-- ARM
UPDATE exercises SET image_url = '/images/exercises/barbell-curl.webp'             WHERE stable_key = 'barbell-curl';
UPDATE exercises SET image_url = '/images/exercises/db-curl.webp'                  WHERE stable_key = 'db-curl';
UPDATE exercises SET image_url = '/images/exercises/hammer-curl-db.webp'           WHERE stable_key = 'hammer-curl-db';
UPDATE exercises SET image_url = '/images/exercises/ez-preacher-curl.webp'         WHERE stable_key = 'ez-preacher-curl';
-- cable-rope-tricep-pushdown: no image (placeholder)
-- cable-overhead-tricep-ext: no image (placeholder)
UPDATE exercises SET image_url = '/images/exercises/ez-lying-tricep-ext.webp'      WHERE stable_key = 'ez-lying-tricep-ext';
-- dips-tricep: no image (placeholder)
UPDATE exercises SET image_url = '/images/exercises/db-wrist-curl.webp'            WHERE stable_key = 'db-wrist-curl';

-- ABS
UPDATE exercises SET image_url = '/images/exercises/crunch.webp'                   WHERE stable_key = 'crunch';
UPDATE exercises SET image_url = '/images/exercises/reverse-crunch.webp'           WHERE stable_key = 'reverse-crunch';
UPDATE exercises SET image_url = '/images/exercises/lying-leg-raise.webp'          WHERE stable_key = 'lying-leg-raise';
UPDATE exercises SET image_url = '/images/exercises/hanging-knee-raise.webp'       WHERE stable_key = 'hanging-knee-raise';
UPDATE exercises SET image_url = '/images/exercises/cable-crunch.webp'             WHERE stable_key = 'cable-crunch';
UPDATE exercises SET image_url = '/images/exercises/ab-rollout-knees.webp'         WHERE stable_key = 'ab-rollout-knees';
UPDATE exercises SET image_url = '/images/exercises/plank.webp'                    WHERE stable_key = 'plank';
UPDATE exercises SET image_url = '/images/exercises/side-plank.webp'               WHERE stable_key = 'side-plank';

-- CARDIO
-- treadmill-walk: no image (placeholder)
UPDATE exercises SET image_url = '/images/exercises/treadmill-run.webp'            WHERE stable_key = 'treadmill-run';
UPDATE exercises SET image_url = '/images/exercises/outdoor-run.webp'              WHERE stable_key = 'outdoor-run';
UPDATE exercises SET image_url = '/images/exercises/stationary-bike.webp'          WHERE stable_key = 'stationary-bike';
UPDATE exercises SET image_url = '/images/exercises/outdoor-cycling.jpg'           WHERE stable_key = 'outdoor-cycling';
UPDATE exercises SET image_url = '/images/exercises/rowing-machine.webp'           WHERE stable_key = 'rowing-machine';
UPDATE exercises SET image_url = '/images/exercises/stair-climber.webp'            WHERE stable_key = 'stair-climber';
