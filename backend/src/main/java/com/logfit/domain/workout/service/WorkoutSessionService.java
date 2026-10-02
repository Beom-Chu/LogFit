package com.logfit.domain.workout.service;

import com.logfit.common.exception.BusinessException;
import com.logfit.common.exception.ErrorCode;
import com.logfit.domain.exercise.entity.Exercise;
import com.logfit.domain.exercise.service.ExerciseService;
import com.logfit.domain.workout.dto.*;
import com.logfit.domain.workout.entity.*;
import com.logfit.domain.workout.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class WorkoutSessionService {

    private final WorkoutSessionRepository sessionRepository;
    private final WorkoutExerciseRepository workoutExerciseRepository;
    private final WorkoutSetRepository workoutSetRepository;
    private final ExerciseService exerciseService;

    @Transactional
    public WorkoutSessionResponse createSession(Long userId, CreateSessionRequest request) {
        WorkoutSessionStatus status = request.getStatus() != null ? request.getStatus() : WorkoutSessionStatus.PLANNED;
        WorkoutSession session = WorkoutSession.builder()
                .userId(userId)
                .workoutDate(request.getWorkoutDate())
                .status(status)
                .memo(request.getMemo())
                .build();
        if (status == WorkoutSessionStatus.IN_PROGRESS) {
            session.start();
        }
        sessionRepository.save(session);
        return new WorkoutSessionResponse(session);
    }

    @Transactional
    public WorkoutSessionResponse startSession(Long userId, Long sessionId) {
        WorkoutSession session = getSessionOwned(userId, sessionId);
        session.start();
        return new WorkoutSessionResponse(session);
    }

    @Transactional
    public WorkoutSessionResponse completeSession(Long userId, Long sessionId) {
        WorkoutSession session = getSessionOwned(userId, sessionId);
        session.complete();
        return new WorkoutSessionResponse(session);
    }

    public WorkoutSessionResponse getCurrentSession(Long userId) {
        WorkoutSession session = sessionRepository.findInProgressByUserId(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.SESSION_NOT_FOUND));
        return new WorkoutSessionResponse(session);
    }

    public List<WorkoutSessionSummary> getPlannedSessions(Long userId) {
        return sessionRepository.findByUserIdAndStatus(userId, WorkoutSessionStatus.PLANNED)
                .stream().map(WorkoutSessionSummary::new).toList();
    }

    public WorkoutSessionResponse getSession(Long userId, Long sessionId) {
        WorkoutSession session = getSessionOwned(userId, sessionId);
        return new WorkoutSessionResponse(session);
    }

    public List<WorkoutSessionSummary> getCompletedSessions(Long userId) {
        return sessionRepository.findCompletedByUserId(userId)
                .stream().map(WorkoutSessionSummary::new).toList();
    }

    @Transactional
    public void deleteSession(Long userId, Long sessionId) {
        WorkoutSession session = getSessionOwned(userId, sessionId);
        sessionRepository.delete(session);
    }

    @Transactional
    public WorkoutSessionResponse updateMemo(Long userId, Long sessionId, UpdateMemoRequest request) {
        WorkoutSession session = getSessionOwned(userId, sessionId);
        session.updateMemo(request.getMemo());
        return new WorkoutSessionResponse(session);
    }

    @Transactional
    public WorkoutExerciseResponse addExercise(Long userId, Long sessionId, AddExerciseRequest request) {
        WorkoutSession session = getSessionOwned(userId, sessionId);
        Exercise exercise = exerciseService.getExerciseEntity(request.getExerciseId());
        int nextOrder = workoutExerciseRepository.findMaxOrderBySessionId(sessionId)
                .map(o -> o + 1).orElse(1);
        WorkoutExercise workoutExercise = WorkoutExercise.builder()
                .workoutSession(session)
                .exerciseId(exercise.getExerciseId())
                .exerciseNameSnapshot(exercise.getName())
                .muscleGroupSnapshot(exercise.getMuscleGroup())
                .exerciseOrder(nextOrder)
                .build();
        workoutExerciseRepository.save(workoutExercise);
        return new WorkoutExerciseResponse(workoutExercise);
    }

    @Transactional
    public void deleteExercise(Long userId, Long workoutExerciseId) {
        WorkoutExercise workoutExercise = workoutExerciseRepository.findById(workoutExerciseId)
                .orElseThrow(() -> new BusinessException(ErrorCode.SESSION_NOT_FOUND));
        validateSessionOwnership(userId, workoutExercise.getWorkoutSession().getSessionId());
        workoutExerciseRepository.delete(workoutExercise);
    }

    @Transactional
    public WorkoutSetResponse addSet(Long userId, Long workoutExerciseId, AddSetRequest request) {
        WorkoutExercise workoutExercise = workoutExerciseRepository.findById(workoutExerciseId)
                .orElseThrow(() -> new BusinessException(ErrorCode.SESSION_NOT_FOUND));
        validateSessionOwnership(userId, workoutExercise.getWorkoutSession().getSessionId());
        int nextOrder = workoutSetRepository.findMaxOrderByWorkoutExerciseId(workoutExerciseId)
                .map(o -> o + 1).orElse(1);
        WorkoutSet set = WorkoutSet.builder()
                .workoutExercise(workoutExercise)
                .setOrder(nextOrder)
                .weight(request.getWeight() != null ? request.getWeight() : BigDecimal.ZERO)
                .reps(request.getReps())
                .build();
        workoutSetRepository.save(set);
        return new WorkoutSetResponse(set);
    }

    @Transactional
    public WorkoutSetResponse updateSet(Long userId, Long setId, UpdateSetRequest request) {
        WorkoutSet set = getSetOwned(userId, setId);
        set.update(request.getWeight(), request.getReps());
        return new WorkoutSetResponse(set);
    }

    @Transactional
    public void deleteSet(Long userId, Long setId) {
        WorkoutSet set = getSetOwned(userId, setId);
        workoutSetRepository.delete(set);
    }

    @Transactional
    public WorkoutSetResponse toggleSetComplete(Long userId, Long setId) {
        WorkoutSet set = getSetOwned(userId, setId);
        set.toggleComplete();
        return new WorkoutSetResponse(set);
    }

    private WorkoutSession getSessionOwned(Long userId, Long sessionId) {
        WorkoutSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new BusinessException(ErrorCode.SESSION_NOT_FOUND));
        if (!session.getUserId().equals(userId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }
        return session;
    }

    private void validateSessionOwnership(Long userId, Long sessionId) {
        WorkoutSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new BusinessException(ErrorCode.SESSION_NOT_FOUND));
        if (!session.getUserId().equals(userId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }
    }

    private WorkoutSet getSetOwned(Long userId, Long setId) {
        WorkoutSet set = workoutSetRepository.findById(setId)
                .orElseThrow(() -> new BusinessException(ErrorCode.SESSION_NOT_FOUND));
        validateSessionOwnership(userId, set.getWorkoutExercise().getWorkoutSession().getSessionId());
        return set;
    }
}
