-- V4: Seed 60 default exercises (idempotent – keyed by stable_key)
-- Running this migration again will not create duplicate rows.
-- ─────────────────────────────────────────────────────────────────────────────
-- Tracking types:
--   WEIGHT_REPS       – weight + reps (most exercises)
--   REPS_ONLY         – bodyweight reps only
--   ASSIST_WEIGHT_REPS– assisted machine (higher assist = more help)
--   TIME_ONLY         – timed holds / cardio
--   DISTANCE_TIME     – distance + time (cardio)
-- ─────────────────────────────────────────────────────────────────────────────

-- ── CHEST (9) ──────────────────────────────────────────────────────────────
INSERT INTO exercises (owner_user_id, name, muscle_group, source_type, tracking_type, stable_key)
SELECT NULL, '바벨 벤치프레스', 'CHEST', 'SYSTEM', 'WEIGHT_REPS', 'barbell-bench-press'
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE stable_key = 'barbell-bench-press');

INSERT INTO exercises (owner_user_id, name, muscle_group, source_type, tracking_type, stable_key)
SELECT NULL, '덤벨 벤치프레스', 'CHEST', 'SYSTEM', 'WEIGHT_REPS', 'db-bench-press'
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE stable_key = 'db-bench-press');

INSERT INTO exercises (owner_user_id, name, muscle_group, source_type, tracking_type, stable_key)
SELECT NULL, '인클라인 바벨 벤치프레스', 'CHEST', 'SYSTEM', 'WEIGHT_REPS', 'incline-bench-press-bb'
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE stable_key = 'incline-bench-press-bb');

INSERT INTO exercises (owner_user_id, name, muscle_group, source_type, tracking_type, stable_key)
SELECT NULL, '인클라인 덤벨 벤치프레스', 'CHEST', 'SYSTEM', 'WEIGHT_REPS', 'incline-bench-press-db'
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE stable_key = 'incline-bench-press-db');

INSERT INTO exercises (owner_user_id, name, muscle_group, source_type, tracking_type, stable_key)
SELECT NULL, '머신 체스트 프레스', 'CHEST', 'SYSTEM', 'WEIGHT_REPS', 'machine-chest-press'
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE stable_key = 'machine-chest-press');

INSERT INTO exercises (owner_user_id, name, muscle_group, source_type, tracking_type, stable_key)
SELECT NULL, '스미스 머신 벤치프레스', 'CHEST', 'SYSTEM', 'WEIGHT_REPS', 'smith-bench-press'
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE stable_key = 'smith-bench-press');

INSERT INTO exercises (owner_user_id, name, muscle_group, source_type, tracking_type, stable_key)
SELECT NULL, '펙덱 플라이', 'CHEST', 'SYSTEM', 'WEIGHT_REPS', 'pec-deck'
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE stable_key = 'pec-deck');

INSERT INTO exercises (owner_user_id, name, muscle_group, source_type, tracking_type, stable_key)
SELECT NULL, '케이블 플라이', 'CHEST', 'SYSTEM', 'WEIGHT_REPS', 'cable-fly'
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE stable_key = 'cable-fly');

INSERT INTO exercises (owner_user_id, name, muscle_group, source_type, tracking_type, stable_key)
SELECT NULL, '푸시업', 'CHEST', 'SYSTEM', 'REPS_ONLY', 'push-up'
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE stable_key = 'push-up');

-- ── BACK (9) ────────────────────────────────────────────────────────────────
INSERT INTO exercises (owner_user_id, name, muscle_group, source_type, tracking_type, stable_key)
SELECT NULL, '풀업', 'BACK', 'SYSTEM', 'REPS_ONLY', 'pull-up'
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE stable_key = 'pull-up');

INSERT INTO exercises (owner_user_id, name, muscle_group, source_type, tracking_type, stable_key)
SELECT NULL, '어시스트 머신 풀업', 'BACK', 'SYSTEM', 'ASSIST_WEIGHT_REPS', 'assisted-pull-up'
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE stable_key = 'assisted-pull-up');

INSERT INTO exercises (owner_user_id, name, muscle_group, source_type, tracking_type, stable_key)
SELECT NULL, '랫풀다운', 'BACK', 'SYSTEM', 'WEIGHT_REPS', 'lat-pulldown'
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE stable_key = 'lat-pulldown');

INSERT INTO exercises (owner_user_id, name, muscle_group, source_type, tracking_type, stable_key)
SELECT NULL, '바벨 로우', 'BACK', 'SYSTEM', 'WEIGHT_REPS', 'barbell-row'
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE stable_key = 'barbell-row');

INSERT INTO exercises (owner_user_id, name, muscle_group, source_type, tracking_type, stable_key)
SELECT NULL, '원암 덤벨 로우', 'BACK', 'SYSTEM', 'WEIGHT_REPS', 'single-arm-db-row'
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE stable_key = 'single-arm-db-row');

INSERT INTO exercises (owner_user_id, name, muscle_group, source_type, tracking_type, stable_key)
SELECT NULL, '시티드 케이블 로우', 'BACK', 'SYSTEM', 'WEIGHT_REPS', 'seated-cable-row'
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE stable_key = 'seated-cable-row');

INSERT INTO exercises (owner_user_id, name, muscle_group, source_type, tracking_type, stable_key)
SELECT NULL, '머신 로우', 'BACK', 'SYSTEM', 'WEIGHT_REPS', 'machine-row'
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE stable_key = 'machine-row');

INSERT INTO exercises (owner_user_id, name, muscle_group, source_type, tracking_type, stable_key)
SELECT NULL, '스트레이트 암 풀다운', 'BACK', 'SYSTEM', 'WEIGHT_REPS', 'straight-arm-pulldown'
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE stable_key = 'straight-arm-pulldown');

INSERT INTO exercises (owner_user_id, name, muscle_group, source_type, tracking_type, stable_key)
SELECT NULL, '백 익스텐션', 'BACK', 'SYSTEM', 'REPS_ONLY', 'back-extension-bw'
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE stable_key = 'back-extension-bw');

-- ── SHOULDER (8) ────────────────────────────────────────────────────────────
INSERT INTO exercises (owner_user_id, name, muscle_group, source_type, tracking_type, stable_key)
SELECT NULL, '바벨 오버헤드 프레스', 'SHOULDER', 'SYSTEM', 'WEIGHT_REPS', 'barbell-ohp'
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE stable_key = 'barbell-ohp');

INSERT INTO exercises (owner_user_id, name, muscle_group, source_type, tracking_type, stable_key)
SELECT NULL, '덤벨 숄더 프레스', 'SHOULDER', 'SYSTEM', 'WEIGHT_REPS', 'seated-db-press'
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE stable_key = 'seated-db-press');

INSERT INTO exercises (owner_user_id, name, muscle_group, source_type, tracking_type, stable_key)
SELECT NULL, '머신 숄더 프레스', 'SHOULDER', 'SYSTEM', 'WEIGHT_REPS', 'machine-shoulder-press'
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE stable_key = 'machine-shoulder-press');

INSERT INTO exercises (owner_user_id, name, muscle_group, source_type, tracking_type, stable_key)
SELECT NULL, '덤벨 레터럴 레이즈', 'SHOULDER', 'SYSTEM', 'WEIGHT_REPS', 'db-lateral-raise'
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE stable_key = 'db-lateral-raise');

INSERT INTO exercises (owner_user_id, name, muscle_group, source_type, tracking_type, stable_key)
SELECT NULL, '케이블 레터럴 레이즈', 'SHOULDER', 'SYSTEM', 'WEIGHT_REPS', 'cable-lateral-raise'
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE stable_key = 'cable-lateral-raise');

INSERT INTO exercises (owner_user_id, name, muscle_group, source_type, tracking_type, stable_key)
SELECT NULL, '벤트오버 덤벨 리어 델트 레이즈', 'SHOULDER', 'SYSTEM', 'WEIGHT_REPS', 'rear-delt-fly-db'
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE stable_key = 'rear-delt-fly-db');

INSERT INTO exercises (owner_user_id, name, muscle_group, source_type, tracking_type, stable_key)
SELECT NULL, '리버스 펙덱 플라이', 'SHOULDER', 'SYSTEM', 'WEIGHT_REPS', 'reverse-pec-deck'
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE stable_key = 'reverse-pec-deck');

INSERT INTO exercises (owner_user_id, name, muscle_group, source_type, tracking_type, stable_key)
SELECT NULL, '케이블 페이스 풀', 'SHOULDER', 'SYSTEM', 'WEIGHT_REPS', 'cable-face-pull'
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE stable_key = 'cable-face-pull');

-- ── LEG / GLUTE (10) ────────────────────────────────────────────────────────
INSERT INTO exercises (owner_user_id, name, muscle_group, source_type, tracking_type, stable_key)
SELECT NULL, '바벨 백 스쿼트', 'LEG', 'SYSTEM', 'WEIGHT_REPS', 'barbell-back-squat'
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE stable_key = 'barbell-back-squat');

INSERT INTO exercises (owner_user_id, name, muscle_group, source_type, tracking_type, stable_key)
SELECT NULL, '바벨 컨벤셔널 데드리프트', 'BACK', 'SYSTEM', 'WEIGHT_REPS', 'barbell-deadlift'
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE stable_key = 'barbell-deadlift');

INSERT INTO exercises (owner_user_id, name, muscle_group, source_type, tracking_type, stable_key)
SELECT NULL, '바벨 루마니안 데드리프트', 'LEG', 'SYSTEM', 'WEIGHT_REPS', 'barbell-rdl'
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE stable_key = 'barbell-rdl');

INSERT INTO exercises (owner_user_id, name, muscle_group, source_type, tracking_type, stable_key)
SELECT NULL, '레그 프레스', 'LEG', 'SYSTEM', 'WEIGHT_REPS', 'leg-press'
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE stable_key = 'leg-press');

INSERT INTO exercises (owner_user_id, name, muscle_group, source_type, tracking_type, stable_key)
SELECT NULL, '레그 익스텐션', 'LEG', 'SYSTEM', 'WEIGHT_REPS', 'leg-extension'
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE stable_key = 'leg-extension');

INSERT INTO exercises (owner_user_id, name, muscle_group, source_type, tracking_type, stable_key)
SELECT NULL, '시티드 레그 컬', 'LEG', 'SYSTEM', 'WEIGHT_REPS', 'seated-leg-curl'
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE stable_key = 'seated-leg-curl');

INSERT INTO exercises (owner_user_id, name, muscle_group, source_type, tracking_type, stable_key)
SELECT NULL, '바벨 힙 쓰러스트', 'GLUTE', 'SYSTEM', 'WEIGHT_REPS', 'barbell-hip-thrust'
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE stable_key = 'barbell-hip-thrust');

INSERT INTO exercises (owner_user_id, name, muscle_group, source_type, tracking_type, stable_key)
SELECT NULL, '덤벨 런지', 'LEG', 'SYSTEM', 'WEIGHT_REPS', 'db-lunge'
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE stable_key = 'db-lunge');

INSERT INTO exercises (owner_user_id, name, muscle_group, source_type, tracking_type, stable_key)
SELECT NULL, '덤벨 불가리안 스플릿 스쿼트', 'LEG', 'SYSTEM', 'WEIGHT_REPS', 'bulgarian-split-squat'
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE stable_key = 'bulgarian-split-squat');

INSERT INTO exercises (owner_user_id, name, muscle_group, source_type, tracking_type, stable_key)
SELECT NULL, '머신 스탠딩 카프 레이즈', 'LEG', 'SYSTEM', 'WEIGHT_REPS', 'machine-calf-raise'
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE stable_key = 'machine-calf-raise');

-- ── ARM: BICEPS (4) + TRICEPS (4) + FOREARM (1) ─────────────────────────────
INSERT INTO exercises (owner_user_id, name, muscle_group, source_type, tracking_type, stable_key)
SELECT NULL, '바벨 컬', 'BICEPS', 'SYSTEM', 'WEIGHT_REPS', 'barbell-curl'
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE stable_key = 'barbell-curl');

INSERT INTO exercises (owner_user_id, name, muscle_group, source_type, tracking_type, stable_key)
SELECT NULL, '덤벨 컬', 'BICEPS', 'SYSTEM', 'WEIGHT_REPS', 'db-curl'
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE stable_key = 'db-curl');

INSERT INTO exercises (owner_user_id, name, muscle_group, source_type, tracking_type, stable_key)
SELECT NULL, '덤벨 해머 컬', 'BICEPS', 'SYSTEM', 'WEIGHT_REPS', 'hammer-curl-db'
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE stable_key = 'hammer-curl-db');

INSERT INTO exercises (owner_user_id, name, muscle_group, source_type, tracking_type, stable_key)
SELECT NULL, 'EZ바 프리처 컬', 'BICEPS', 'SYSTEM', 'WEIGHT_REPS', 'ez-preacher-curl'
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE stable_key = 'ez-preacher-curl');

INSERT INTO exercises (owner_user_id, name, muscle_group, source_type, tracking_type, stable_key)
SELECT NULL, '케이블 로프 트라이셉스 푸시다운', 'TRICEPS', 'SYSTEM', 'WEIGHT_REPS', 'cable-rope-tricep-pushdown'
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE stable_key = 'cable-rope-tricep-pushdown');

INSERT INTO exercises (owner_user_id, name, muscle_group, source_type, tracking_type, stable_key)
SELECT NULL, '케이블 오버헤드 트라이셉스 익스텐션', 'TRICEPS', 'SYSTEM', 'WEIGHT_REPS', 'cable-overhead-tricep-ext'
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE stable_key = 'cable-overhead-tricep-ext');

INSERT INTO exercises (owner_user_id, name, muscle_group, source_type, tracking_type, stable_key)
SELECT NULL, 'EZ바 라잉 트라이셉스 익스텐션', 'TRICEPS', 'SYSTEM', 'WEIGHT_REPS', 'ez-lying-tricep-ext'
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE stable_key = 'ez-lying-tricep-ext');

INSERT INTO exercises (owner_user_id, name, muscle_group, source_type, tracking_type, stable_key)
SELECT NULL, '딥스 — 삼두 중심', 'TRICEPS', 'SYSTEM', 'REPS_ONLY', 'dips-tricep'
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE stable_key = 'dips-tricep');

INSERT INTO exercises (owner_user_id, name, muscle_group, source_type, tracking_type, stable_key)
SELECT NULL, '덤벨 리스트 컬', 'FOREARM', 'SYSTEM', 'WEIGHT_REPS', 'db-wrist-curl'
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE stable_key = 'db-wrist-curl');

-- ── ABS (8) ─────────────────────────────────────────────────────────────────
INSERT INTO exercises (owner_user_id, name, muscle_group, source_type, tracking_type, stable_key)
SELECT NULL, '크런치', 'ABS', 'SYSTEM', 'REPS_ONLY', 'crunch'
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE stable_key = 'crunch');

INSERT INTO exercises (owner_user_id, name, muscle_group, source_type, tracking_type, stable_key)
SELECT NULL, '리버스 크런치', 'ABS', 'SYSTEM', 'REPS_ONLY', 'reverse-crunch'
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE stable_key = 'reverse-crunch');

INSERT INTO exercises (owner_user_id, name, muscle_group, source_type, tracking_type, stable_key)
SELECT NULL, '라잉 레그 레이즈', 'ABS', 'SYSTEM', 'REPS_ONLY', 'lying-leg-raise'
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE stable_key = 'lying-leg-raise');

INSERT INTO exercises (owner_user_id, name, muscle_group, source_type, tracking_type, stable_key)
SELECT NULL, '행잉 니 레이즈', 'ABS', 'SYSTEM', 'REPS_ONLY', 'hanging-knee-raise'
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE stable_key = 'hanging-knee-raise');

INSERT INTO exercises (owner_user_id, name, muscle_group, source_type, tracking_type, stable_key)
SELECT NULL, '케이블 크런치', 'ABS', 'SYSTEM', 'WEIGHT_REPS', 'cable-crunch'
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE stable_key = 'cable-crunch');

INSERT INTO exercises (owner_user_id, name, muscle_group, source_type, tracking_type, stable_key)
SELECT NULL, '무릎 대고 AB 롤아웃', 'ABS', 'SYSTEM', 'REPS_ONLY', 'ab-rollout-knees'
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE stable_key = 'ab-rollout-knees');

INSERT INTO exercises (owner_user_id, name, muscle_group, source_type, tracking_type, stable_key)
SELECT NULL, '플랭크', 'ABS', 'SYSTEM', 'TIME_ONLY', 'plank'
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE stable_key = 'plank');

INSERT INTO exercises (owner_user_id, name, muscle_group, source_type, tracking_type, stable_key)
SELECT NULL, '사이드 플랭크', 'ABS', 'SYSTEM', 'TIME_ONLY', 'side-plank'
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE stable_key = 'side-plank');

-- ── CARDIO (7) ──────────────────────────────────────────────────────────────
INSERT INTO exercises (owner_user_id, name, muscle_group, source_type, tracking_type, stable_key)
SELECT NULL, '트레드밀 걷기', 'CARDIO', 'SYSTEM', 'DISTANCE_TIME', 'treadmill-walk'
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE stable_key = 'treadmill-walk');

INSERT INTO exercises (owner_user_id, name, muscle_group, source_type, tracking_type, stable_key)
SELECT NULL, '트레드밀 러닝', 'CARDIO', 'SYSTEM', 'DISTANCE_TIME', 'treadmill-run'
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE stable_key = 'treadmill-run');

INSERT INTO exercises (owner_user_id, name, muscle_group, source_type, tracking_type, stable_key)
SELECT NULL, '야외 러닝', 'CARDIO', 'SYSTEM', 'DISTANCE_TIME', 'outdoor-run'
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE stable_key = 'outdoor-run');

INSERT INTO exercises (owner_user_id, name, muscle_group, source_type, tracking_type, stable_key)
SELECT NULL, '실내 사이클', 'CARDIO', 'SYSTEM', 'DISTANCE_TIME', 'stationary-bike'
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE stable_key = 'stationary-bike');

INSERT INTO exercises (owner_user_id, name, muscle_group, source_type, tracking_type, stable_key)
SELECT NULL, '야외 사이클', 'CARDIO', 'SYSTEM', 'DISTANCE_TIME', 'outdoor-cycling'
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE stable_key = 'outdoor-cycling');

INSERT INTO exercises (owner_user_id, name, muscle_group, source_type, tracking_type, stable_key)
SELECT NULL, '로잉 머신', 'CARDIO', 'SYSTEM', 'DISTANCE_TIME', 'rowing-machine'
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE stable_key = 'rowing-machine');

INSERT INTO exercises (owner_user_id, name, muscle_group, source_type, tracking_type, stable_key)
SELECT NULL, '스텝밀', 'CARDIO', 'SYSTEM', 'TIME_ONLY', 'stair-climber'
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE stable_key = 'stair-climber');
