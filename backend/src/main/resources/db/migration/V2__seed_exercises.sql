-- System Exercise Seed Data
INSERT INTO exercises (owner_user_id, name, muscle_group, source_type, tracking_type) VALUES
-- CHEST
(NULL, '벤치프레스', 'CHEST', 'SYSTEM', 'WEIGHT_REPS'),
(NULL, '인클라인 벤치프레스', 'CHEST', 'SYSTEM', 'WEIGHT_REPS'),
(NULL, '디클라인 벤치프레스', 'CHEST', 'SYSTEM', 'WEIGHT_REPS'),
(NULL, '덤벨 플라이', 'CHEST', 'SYSTEM', 'WEIGHT_REPS'),
(NULL, '케이블 크로스오버', 'CHEST', 'SYSTEM', 'WEIGHT_REPS'),
(NULL, '딥스', 'CHEST', 'SYSTEM', 'REPS_ONLY'),
(NULL, '푸쉬업', 'CHEST', 'SYSTEM', 'REPS_ONLY'),
-- BACK
(NULL, '데드리프트', 'BACK', 'SYSTEM', 'WEIGHT_REPS'),
(NULL, '바벨 로우', 'BACK', 'SYSTEM', 'WEIGHT_REPS'),
(NULL, '덤벨 로우', 'BACK', 'SYSTEM', 'WEIGHT_REPS'),
(NULL, '랫풀다운', 'BACK', 'SYSTEM', 'WEIGHT_REPS'),
(NULL, '시티드 로우', 'BACK', 'SYSTEM', 'WEIGHT_REPS'),
(NULL, '풀업', 'BACK', 'SYSTEM', 'REPS_ONLY'),
(NULL, '친업', 'BACK', 'SYSTEM', 'REPS_ONLY'),
-- SHOULDER
(NULL, '오버헤드 프레스', 'SHOULDER', 'SYSTEM', 'WEIGHT_REPS'),
(NULL, '덤벨 숄더 프레스', 'SHOULDER', 'SYSTEM', 'WEIGHT_REPS'),
(NULL, '레터럴 레이즈', 'SHOULDER', 'SYSTEM', 'WEIGHT_REPS'),
(NULL, '프론트 레이즈', 'SHOULDER', 'SYSTEM', 'WEIGHT_REPS'),
(NULL, '페이스풀', 'SHOULDER', 'SYSTEM', 'WEIGHT_REPS'),
(NULL, '리어 델트 플라이', 'SHOULDER', 'SYSTEM', 'WEIGHT_REPS'),
-- BICEPS
(NULL, '바벨 컬', 'BICEPS', 'SYSTEM', 'WEIGHT_REPS'),
(NULL, '덤벨 컬', 'BICEPS', 'SYSTEM', 'WEIGHT_REPS'),
(NULL, '해머 컬', 'BICEPS', 'SYSTEM', 'WEIGHT_REPS'),
(NULL, '인클라인 덤벨 컬', 'BICEPS', 'SYSTEM', 'WEIGHT_REPS'),
(NULL, '케이블 컬', 'BICEPS', 'SYSTEM', 'WEIGHT_REPS'),
-- TRICEPS
(NULL, '트라이셉스 푸쉬다운', 'TRICEPS', 'SYSTEM', 'WEIGHT_REPS'),
(NULL, '오버헤드 트라이셉스 익스텐션', 'TRICEPS', 'SYSTEM', 'WEIGHT_REPS'),
(NULL, '스컬 크러셔', 'TRICEPS', 'SYSTEM', 'WEIGHT_REPS'),
(NULL, '클로즈 그립 벤치프레스', 'TRICEPS', 'SYSTEM', 'WEIGHT_REPS'),
(NULL, '케이블 킥백', 'TRICEPS', 'SYSTEM', 'WEIGHT_REPS'),
-- FOREARM
(NULL, '리스트 컬', 'FOREARM', 'SYSTEM', 'WEIGHT_REPS'),
(NULL, '리버스 리스트 컬', 'FOREARM', 'SYSTEM', 'WEIGHT_REPS'),
-- LEG
(NULL, '스쿼트', 'LEG', 'SYSTEM', 'WEIGHT_REPS'),
(NULL, '레그 프레스', 'LEG', 'SYSTEM', 'WEIGHT_REPS'),
(NULL, '런지', 'LEG', 'SYSTEM', 'WEIGHT_REPS'),
(NULL, '레그 익스텐션', 'LEG', 'SYSTEM', 'WEIGHT_REPS'),
(NULL, '레그 컬', 'LEG', 'SYSTEM', 'WEIGHT_REPS'),
(NULL, '루마니안 데드리프트', 'LEG', 'SYSTEM', 'WEIGHT_REPS'),
(NULL, '카프 레이즈', 'LEG', 'SYSTEM', 'WEIGHT_REPS'),
-- GLUTE
(NULL, '힙 쓰러스트', 'GLUTE', 'SYSTEM', 'WEIGHT_REPS'),
(NULL, '케이블 킥백', 'GLUTE', 'SYSTEM', 'WEIGHT_REPS'),
(NULL, '글루트 브릿지', 'GLUTE', 'SYSTEM', 'REPS_ONLY'),
-- ABS
(NULL, '크런치', 'ABS', 'SYSTEM', 'REPS_ONLY'),
(NULL, '플랭크', 'ABS', 'SYSTEM', 'TIME_ONLY'),
(NULL, '레그 레이즈', 'ABS', 'SYSTEM', 'REPS_ONLY'),
(NULL, '케이블 크런치', 'ABS', 'SYSTEM', 'WEIGHT_REPS'),
(NULL, '사이드 플랭크', 'ABS', 'SYSTEM', 'TIME_ONLY'),
-- CARDIO
(NULL, '러닝', 'CARDIO', 'SYSTEM', 'DISTANCE_TIME'),
(NULL, '사이클', 'CARDIO', 'SYSTEM', 'DISTANCE_TIME'),
(NULL, '일립티컬', 'CARDIO', 'SYSTEM', 'TIME_ONLY'),
(NULL, '로잉머신', 'CARDIO', 'SYSTEM', 'DISTANCE_TIME'),
(NULL, '스텝밀', 'CARDIO', 'SYSTEM', 'TIME_ONLY'),
(NULL, '줄넘기', 'CARDIO', 'SYSTEM', 'TIME_ONLY');
