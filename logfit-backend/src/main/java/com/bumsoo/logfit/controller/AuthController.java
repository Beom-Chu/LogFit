package com.bumsoo.logfit.controller;

import com.bumsoo.logfit.dto.LoginRequest;
import com.bumsoo.logfit.dto.LoginResponse;
import com.bumsoo.logfit.dto.SignupRequest;
import com.bumsoo.logfit.dto.SignupResponse;
import com.bumsoo.logfit.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * 회원가입 API
     * POST /api/auth/signup
     */
    @PostMapping("/signup")
    public ResponseEntity<SignupResponse> signup(@Valid @RequestBody SignupRequest signupRequest) {
        try {
            SignupResponse response = authService.signup(signupRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            log.error("Signup failed: {}", e.getMessage());
            return ResponseEntity.badRequest().body(
                    SignupResponse.builder()
                            .message(e.getMessage())
                            .build()
            );
        }
    }

    /**
     * 로그인 API
     * POST /api/auth/login
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            LoginResponse response = authService.login(loginRequest);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            log.error("Login failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                    LoginResponse.builder()
                            .tokenType("Bearer")
                            .build()
            );
        }
    }

    /**
     * Refresh Token으로 새 Access Token 발급
     * POST /api/auth/refresh
     */
    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestBody RefreshTokenRequest request) {
        try {
            String newAccessToken = authService.refreshAccessToken(request.refreshToken());
            return ResponseEntity.ok(new AccessTokenResponse(newAccessToken, "Bearer"));
        } catch (IllegalArgumentException e) {
            log.error("Token refresh failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                    new ErrorResponse(e.getMessage())
            );
        }
    }

    /**
     * 로그아웃 API
     * POST /api/auth/logout
     */
    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("X-User-Id") Long userId) {
        try {
            authService.logout(userId);
            return ResponseEntity.ok(new MessageResponse("로그아웃되었습니다"));
        } catch (IllegalArgumentException e) {
            log.error("Logout failed: {}", e.getMessage());
            return ResponseEntity.badRequest().body(
                    new ErrorResponse(e.getMessage())
            );
        }
    }

    /**
     * 게스트 로그인 API
     * POST /api/auth/guest
     */
    @PostMapping("/guest")
    public ResponseEntity<LoginResponse> guestLogin() {
        try {
            LoginResponse response = authService.guestLogin();
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Guest login failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    LoginResponse.builder()
                            .tokenType("Bearer")
                            .build()
            );
        }
    }

    // 내부 DTO 클래스들
    public record RefreshTokenRequest(String refreshToken) {}

    public record AccessTokenResponse(String accessToken, String tokenType) {}

    public record ErrorResponse(String message) {}

    public record MessageResponse(String message) {}
}

