package com.logfit.domain.body.controller;

import com.logfit.common.response.ApiResponse;
import com.logfit.domain.body.dto.BodyCompositionChartPoint;
import com.logfit.domain.body.dto.BodyCompositionRequest;
import com.logfit.domain.body.dto.BodyCompositionResponse;
import com.logfit.domain.body.service.BodyCompositionService;
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

@Tag(name = "Body Composition", description = "체성분 기록 API")
@RestController
@RequestMapping("/api/v1/body-compositions")
@RequiredArgsConstructor
public class BodyCompositionController {

    private final BodyCompositionService bodyCompositionService;

    @Operation(summary = "체성분 기록 생성")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<BodyCompositionResponse> create(
            @AuthenticationPrincipal Long userId,
            @Valid @RequestBody BodyCompositionRequest request) {
        return ApiResponse.success(bodyCompositionService.create(userId, request));
    }

    @Operation(summary = "체성분 목록 조회")
    @GetMapping
    public ApiResponse<List<BodyCompositionResponse>> getAll(@AuthenticationPrincipal Long userId) {
        return ApiResponse.success(bodyCompositionService.getAll(userId));
    }

    @Operation(summary = "최근 체성분 조회")
    @GetMapping("/latest")
    public ApiResponse<BodyCompositionResponse> getLatest(@AuthenticationPrincipal Long userId) {
        return ApiResponse.success(bodyCompositionService.getLatest(userId));
    }

    @Operation(summary = "체성분 상세 조회")
    @GetMapping("/{bodyCompositionId}")
    public ApiResponse<BodyCompositionResponse> getById(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long bodyCompositionId) {
        return ApiResponse.success(bodyCompositionService.getById(userId, bodyCompositionId));
    }

    @Operation(summary = "체성분 수정")
    @PutMapping("/{bodyCompositionId}")
    public ApiResponse<BodyCompositionResponse> update(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long bodyCompositionId,
            @Valid @RequestBody BodyCompositionRequest request) {
        return ApiResponse.success(bodyCompositionService.update(userId, bodyCompositionId, request));
    }

    @Operation(summary = "체성분 삭제")
    @DeleteMapping("/{bodyCompositionId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long bodyCompositionId) {
        bodyCompositionService.delete(userId, bodyCompositionId);
    }

    @Operation(summary = "체성분 차트 데이터 조회")
    @GetMapping("/chart")
    public ApiResponse<List<BodyCompositionChartPoint>> getChart(
            @AuthenticationPrincipal Long userId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return ApiResponse.success(bodyCompositionService.getChart(userId, from, to));
    }
}
