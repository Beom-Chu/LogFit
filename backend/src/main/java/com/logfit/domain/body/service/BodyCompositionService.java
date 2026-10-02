package com.logfit.domain.body.service;

import com.logfit.common.exception.BusinessException;
import com.logfit.common.exception.ErrorCode;
import com.logfit.domain.body.dto.BodyCompositionChartPoint;
import com.logfit.domain.body.dto.BodyCompositionRequest;
import com.logfit.domain.body.dto.BodyCompositionResponse;
import com.logfit.domain.body.entity.BodyComposition;
import com.logfit.domain.body.entity.BodyWeight;
import com.logfit.domain.body.repository.BodyCompositionRepository;
import com.logfit.domain.body.repository.BodyWeightRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BodyCompositionService {

    private final BodyCompositionRepository bodyCompositionRepository;
    private final BodyWeightRepository bodyWeightRepository;

    @Transactional
    public BodyCompositionResponse create(Long userId, BodyCompositionRequest request) {
        if (bodyCompositionRepository.existsByUserIdAndMeasureDate(userId, request.getMeasureDate())) {
            throw new BusinessException(ErrorCode.BODY_COMPOSITION_ALREADY_EXISTS);
        }
        BodyComposition bc = BodyComposition.builder()
                .userId(userId)
                .weight(request.getWeight())
                .skeletalMuscleMass(request.getSkeletalMuscleMass())
                .bodyFatPercentage(request.getBodyFatPercentage())
                .measureDate(request.getMeasureDate())
                .build();
        bodyCompositionRepository.save(bc);

        // Auto-create BodyWeight if not already recorded for this date
        if (!bodyWeightRepository.existsByUserIdAndMeasureDate(userId, request.getMeasureDate())) {
            BodyWeight bw = BodyWeight.builder()
                    .userId(userId)
                    .weight(request.getWeight())
                    .measureDate(request.getMeasureDate())
                    .build();
            bodyWeightRepository.save(bw);
        }
        return new BodyCompositionResponse(bc);
    }

    public List<BodyCompositionResponse> getAll(Long userId) {
        return bodyCompositionRepository.findByUserIdOrderByMeasureDateDesc(userId)
                .stream().map(BodyCompositionResponse::new).toList();
    }

    public BodyCompositionResponse getById(Long userId, Long compositionId) {
        BodyComposition bc = findOwned(userId, compositionId);
        return new BodyCompositionResponse(bc);
    }

    public BodyCompositionResponse getLatest(Long userId) {
        BodyComposition bc = bodyCompositionRepository.findLatestByUserId(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.BODY_COMPOSITION_NOT_FOUND));
        return new BodyCompositionResponse(bc);
    }

    @Transactional
    public BodyCompositionResponse update(Long userId, Long compositionId, BodyCompositionRequest request) {
        BodyComposition bc = findOwned(userId, compositionId);
        bc.update(request.getWeight(), request.getSkeletalMuscleMass(), request.getBodyFatPercentage());
        return new BodyCompositionResponse(bc);
    }

    @Transactional
    public void delete(Long userId, Long compositionId) {
        BodyComposition bc = findOwned(userId, compositionId);
        bodyCompositionRepository.delete(bc);
    }

    public List<BodyCompositionChartPoint> getChart(Long userId, LocalDate from, LocalDate to) {
        LocalDate end = to != null ? to : LocalDate.now();
        LocalDate start = from != null ? from : end.minusDays(89);
        return bodyCompositionRepository.findChartData(userId, start, end)
                .stream().map(BodyCompositionChartPoint::new).toList();
    }

    private BodyComposition findOwned(Long userId, Long compositionId) {
        BodyComposition bc = bodyCompositionRepository.findById(compositionId)
                .orElseThrow(() -> new BusinessException(ErrorCode.BODY_COMPOSITION_NOT_FOUND));
        if (!bc.getUserId().equals(userId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }
        return bc;
    }
}
