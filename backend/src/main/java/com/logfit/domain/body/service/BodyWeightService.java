package com.logfit.domain.body.service;

import com.logfit.common.exception.BusinessException;
import com.logfit.common.exception.ErrorCode;
import com.logfit.domain.body.dto.BodyWeightChartPoint;
import com.logfit.domain.body.dto.BodyWeightRequest;
import com.logfit.domain.body.dto.BodyWeightResponse;
import com.logfit.domain.body.entity.BodyWeight;
import com.logfit.domain.body.repository.BodyWeightRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BodyWeightService {

    private final BodyWeightRepository bodyWeightRepository;

    @Transactional
    public BodyWeightResponse create(Long userId, BodyWeightRequest request) {
        if (bodyWeightRepository.existsByUserIdAndMeasureDate(userId, request.getMeasureDate())) {
            throw new BusinessException(ErrorCode.WEIGHT_ALREADY_EXISTS);
        }
        BodyWeight bw = BodyWeight.builder()
                .userId(userId)
                .weight(request.getWeight())
                .measureDate(request.getMeasureDate())
                .build();
        bodyWeightRepository.save(bw);
        return new BodyWeightResponse(bw);
    }

    public List<BodyWeightResponse> getAll(Long userId) {
        return bodyWeightRepository.findByUserIdOrderByMeasureDateDesc(userId)
                .stream().map(BodyWeightResponse::new).toList();
    }

    public BodyWeightResponse getById(Long userId, Long weightId) {
        BodyWeight bw = findOwned(userId, weightId);
        return new BodyWeightResponse(bw);
    }

    public BodyWeightResponse getLatest(Long userId) {
        BodyWeight bw = bodyWeightRepository.findLatestByUserId(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.WEIGHT_NOT_FOUND));
        return new BodyWeightResponse(bw);
    }

    @Transactional
    public BodyWeightResponse update(Long userId, Long weightId, BodyWeightRequest request) {
        BodyWeight bw = findOwned(userId, weightId);
        bw.update(request.getWeight());
        return new BodyWeightResponse(bw);
    }

    @Transactional
    public void delete(Long userId, Long weightId) {
        BodyWeight bw = findOwned(userId, weightId);
        bodyWeightRepository.delete(bw);
    }

    public List<BodyWeightChartPoint> getChart(Long userId, LocalDate from, LocalDate to) {
        LocalDate end = to != null ? to : LocalDate.now();
        LocalDate start = from != null ? from : end.minusDays(89);
        return bodyWeightRepository.findChartData(userId, start, end)
                .stream().map(BodyWeightChartPoint::new).toList();
    }

    private BodyWeight findOwned(Long userId, Long weightId) {
        BodyWeight bw = bodyWeightRepository.findById(weightId)
                .orElseThrow(() -> new BusinessException(ErrorCode.WEIGHT_NOT_FOUND));
        if (!bw.getUserId().equals(userId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }
        return bw;
    }
}
