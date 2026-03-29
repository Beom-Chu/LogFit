package com.bumsoo.logfit.controller;

import com.bumsoo.logfit.dto.UserProfileResponse;
import com.bumsoo.logfit.entity.User;
import com.bumsoo.logfit.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Slf4j
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    /**
     * 현재 사용자 프로필 조회
     * GET /api/users/me
     */
    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> getCurrentUser(Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();
            log.info("사용자 프로필 조회: {}", user.getEmail());
            return ResponseEntity.ok(toResponse(user));
        } catch (Exception e) {
            log.error("프로필 조회 실패: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * 사용자 정보 조회 (ID로)
     * GET /api/users/{userId}
     */
    @GetMapping("/{userId}")
    public ResponseEntity<UserProfileResponse> getUserById(@PathVariable Long userId) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다"));
            return ResponseEntity.ok(toResponse(user));
        } catch (IllegalArgumentException e) {
            log.error("사용자 조회 실패: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * 사용자 정보 수정
     * PUT /api/users/me
     */
    @PutMapping("/me")
    public ResponseEntity<UserProfileResponse> updateProfile(
            Authentication authentication,
            @RequestBody UpdateProfileRequest request) {
        try {
            User user = (User) authentication.getPrincipal();

            if (request.username() != null && !request.username().isBlank()) {
                user.setUsername(request.username());
            }
            if (request.weightKg() != null) {
                user.setWeightKg(request.weightKg());
            }
            if (request.heightCm() != null) {
                user.setHeightCm(request.heightCm());
            }
            if (request.birthDate() != null) {
                user.setBirthDate(request.birthDate());
            }

            userRepository.save(user);
            log.info("사용자 정보 수정: {}", user.getEmail());
            return ResponseEntity.ok(toResponse(user));
        } catch (Exception e) {
            log.error("프로필 수정 실패: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    private UserProfileResponse toResponse(User user) {
        return UserProfileResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .isActive(user.getIsActive())
                .createdAt(user.getCreatedAt())
                .weightKg(user.getWeightKg())
                .heightCm(user.getHeightCm())
                .birthDate(user.getBirthDate())
                .roles(user.getRoles().stream()
                        .map(role -> role.getRoleType().toString())
                        .toList())
                .build();
    }

    // 내부 DTO
    public record UpdateProfileRequest(
            String username,
            BigDecimal weightKg,
            BigDecimal heightCm,
            LocalDate birthDate
    ) {}
}

