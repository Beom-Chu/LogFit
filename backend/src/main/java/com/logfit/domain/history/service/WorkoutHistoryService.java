package com.logfit.domain.history.service;

import com.logfit.common.exception.BusinessException;
import com.logfit.common.exception.ErrorCode;
import com.logfit.domain.history.dto.WorkoutHistoryDetailResponse;
import com.logfit.domain.workout.dto.WorkoutSessionSummary;
import com.logfit.domain.workout.entity.WorkoutSession;
import com.logfit.domain.workout.entity.WorkoutSessionStatus;
import com.logfit.domain.workout.repository.WorkoutSessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class WorkoutHistoryService {

    private final WorkoutSessionRepository sessionRepository;

    public List<WorkoutSessionSummary> getHistory(Long userId) {
        return sessionRepository.findCompletedByUserId(userId)
                .stream().map(WorkoutSessionSummary::new).toList();
    }

    public WorkoutHistoryDetailResponse getHistoryDetail(Long userId, Long sessionId) {
        WorkoutSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new BusinessException(ErrorCode.SESSION_NOT_FOUND));
        if (!session.getUserId().equals(userId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }
        if (session.getStatus() != WorkoutSessionStatus.COMPLETED) {
            throw new BusinessException(ErrorCode.SESSION_NOT_FOUND);
        }
        return new WorkoutHistoryDetailResponse(session);
    }
}
