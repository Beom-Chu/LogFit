package com.bumsoo.logfit.controller;

import com.bumsoo.logfit.dto.CreateWorkoutRecordRequest;
import com.bumsoo.logfit.dto.WeeklyWorkoutSummaryResponse;
import com.bumsoo.logfit.dto.WorkoutRecordResponse;
import com.bumsoo.logfit.entity.User;
import com.bumsoo.logfit.service.WorkoutService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/workouts")
@RequiredArgsConstructor
public class WorkoutController {

    private final WorkoutService workoutService;

    @PostMapping
    public ResponseEntity<WorkoutRecordResponse> createWorkoutRecord(
            Authentication authentication,
            @Valid @RequestBody CreateWorkoutRecordRequest request) {

        User user = (User) authentication.getPrincipal();
        WorkoutRecordResponse response = workoutService.createRecord(user, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<WorkoutRecordResponse>> getMyWorkoutRecords(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(workoutService.getMyRecords(user));
    }

    @GetMapping("/summary/weekly")
    public ResponseEntity<WeeklyWorkoutSummaryResponse> getWeeklySummary(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(workoutService.getWeeklySummary(user));
    }

    @PutMapping("/{recordId}")
    public ResponseEntity<WorkoutRecordResponse> updateWorkoutRecord(
            Authentication authentication,
            @PathVariable Long recordId,
            @Valid @RequestBody CreateWorkoutRecordRequest request) {

        User user = (User) authentication.getPrincipal();
        WorkoutRecordResponse response = workoutService.updateRecord(user, recordId, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{recordId}")
    public ResponseEntity<Void> deleteWorkoutRecord(
            Authentication authentication,
            @PathVariable Long recordId) {

        User user = (User) authentication.getPrincipal();
        workoutService.deleteRecord(user, recordId);
        return ResponseEntity.noContent().build();
    }
}
