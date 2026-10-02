package com.logfit.domain.body.controller;

import com.logfit.common.response.ApiResponse;
import com.logfit.domain.body.dto.BodyWeightChartPoint;
import com.logfit.domain.body.dto.BodyWeightRequest;
import com.logfit.domain.body.dto.BodyWeightResponse;
import com.logfit.domain.body.service.BodyWeightService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@Tag(name = "Body Weight", description = "체중 기록 API")
@RestController
@RequestMapping("/api/v1/body-weights")
@RequiredArgsConstructor
public class BodyWeightController {

    private final BodyWeightService bodyWeightService;

    @Operation(summary = "체중 기록 생성")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<BodyWeightResponse> create(
            @AuthenticationPrincipal Long userId,
            @Valid @RequestBody BodyWeightRequest request) {
        return ApiResponse.success(bodyWeightService.create(userId, request));
    }

    @Operation(summary = "체중 목록 조회")
    @GetMapping
    public ApiResponse<List<BodyWeightResponse>> getAll(@AuthenticationPrincipal Long userId) {
        return ApiResponse.success(bodyWeightService.getAll(userId));
    }

    @Operation(summary = "최근 체중 조회")
    @GetMapping("/latest")
    public ApiResponse<BodyWeightResponse> getLatest(@AuthenticationPrincipal Long userId) {
        return ApiResponse.success(bodyWeightService.getLatest(userId));
    }

    @Operation(summary = "체중 상세 조회")
    @GetMapping("/{weightId}")
    public ApiResponse<BodyWeightResponse> getById(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long weightId) {
        return ApiResponse.success(bodyWeightService.getById(userId, weightId));
    }

    @Operation(summary = "체중 수정")
    @PutMapping("/{weightId}")
    public ApiResponse<BodyWeightResponse> update(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long weightId,
            @Valid @RequestBody BodyWeightRequest request) {
        return ApiResponse.success(bodyWeightService.update(userId, weightId, request));
    }

    @Operation(summary = "체중 삭제")
    @DeleteMapping("/{weightId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long weightId) {
        bodyWeightService.delete(userId, weightId);
    }

    @Operation(summary = "체중 차트 데이터 조회")
    @GetMapping("/chart")
    public ApiResponse<List<BodyWeightChartPoint>> getChart(
            @AuthenticationPrincipal Long userId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return ApiResponse.success(bodyWeightService.getChart(userId, from, to));
    }
}
