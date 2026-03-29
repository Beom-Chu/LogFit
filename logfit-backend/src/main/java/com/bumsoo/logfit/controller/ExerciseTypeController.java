package com.bumsoo.logfit.controller;

import com.bumsoo.logfit.dto.CreateExerciseTypeRequest;
import com.bumsoo.logfit.dto.ExerciseTypeResponse;
import com.bumsoo.logfit.entity.User;
import com.bumsoo.logfit.service.ExerciseTypeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exercises")
@RequiredArgsConstructor
public class ExerciseTypeController {

    private final ExerciseTypeService exerciseTypeService;

    @GetMapping
    public ResponseEntity<List<ExerciseTypeResponse>> getAvailableExercises(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(exerciseTypeService.getAvailableExerciseTypes(user));
    }

    @PostMapping
    public ResponseEntity<ExerciseTypeResponse> createCustomExercise(
            Authentication authentication,
            @Valid @RequestBody CreateExerciseTypeRequest request) {

        User user = (User) authentication.getPrincipal();
        ExerciseTypeResponse response = exerciseTypeService.createCustomExerciseType(user, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}

