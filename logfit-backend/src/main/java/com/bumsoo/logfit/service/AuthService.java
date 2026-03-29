package com.bumsoo.logfit.service;

import com.bumsoo.logfit.dto.LoginRequest;
import com.bumsoo.logfit.dto.LoginResponse;
import com.bumsoo.logfit.dto.SignupRequest;
import com.bumsoo.logfit.dto.SignupResponse;
import com.bumsoo.logfit.entity.RefreshToken;
import com.bumsoo.logfit.entity.Role;
import com.bumsoo.logfit.entity.User;
import com.bumsoo.logfit.repository.RefreshTokenRepository;
import com.bumsoo.logfit.repository.RoleRepository;
import com.bumsoo.logfit.repository.UserRepository;
import com.bumsoo.logfit.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {

    private static final String GUEST_USERNAME = "게스트";
    private static final String GUEST_EMAIL = "guest@logfit.local";

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    /**
     * 회원가입 처리
     */
    public SignupResponse signup(SignupRequest signupRequest) {
        // 비밀번호 일치 확인
        if (!signupRequest.getPassword().equals(signupRequest.getPasswordConfirm())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다");
        }

        // 이메일 중복 확인
        if (userRepository.existsByEmail(signupRequest.getEmail())) {
            throw new IllegalArgumentException("이미 존재하는 이메일입니다");
        }

        // 사용자명 중복 확인
        if (userRepository.existsByUsername(signupRequest.getUsername())) {
            throw new IllegalArgumentException("이미 존재하는 사용자명입니다");
        }

        // 사용자 생성
        User user = User.builder()
                .username(signupRequest.getUsername())
                .email(signupRequest.getEmail())
                .password(passwordEncoder.encode(signupRequest.getPassword()))
                .isActive(true)
                .build();

        // 기본 역할(ROLE_USER) 추가
        Optional<Role> userRole = roleRepository.findByRoleType(Role.RoleType.ROLE_USER);
        if (userRole.isPresent()) {
            user.addRole(userRole.get());
        }

        User savedUser = userRepository.save(user);
        log.info("New user registered: {}", savedUser.getEmail());

        return SignupResponse.builder()
                .userId(savedUser.getId())
                .username(savedUser.getUsername())
                .email(savedUser.getEmail())
                .message("회원가입이 완료되었습니다")
                .build();
    }

    /**
     * 로그인 처리
     */
    public LoginResponse login(LoginRequest loginRequest) {
        // 사용자 조회
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다"));

        // 비밀번호 확인
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 올바르지 않습니다");
        }

        // 활성화 여부 확인
        if (!user.getIsActive()) {
            throw new IllegalArgumentException("비활성화된 계정입니다");
        }

        // JWT 토큰 생성
        String accessToken = jwtTokenProvider.generateAccessToken(user.getId(), user.getEmail());
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getId(), user.getEmail());

        // Refresh Token 저장
        saveRefreshToken(user, refreshToken);

        log.info("User logged in: {}", user.getEmail());

        return LoginResponse.of(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                accessToken,
                refreshToken,
                jwtTokenProvider.getAccessTokenExpiration()
        );
    }

    /**
     * Refresh Token 저장
     */
    private void saveRefreshToken(User user, String refreshToken) {
        LocalDateTime expiresAt = LocalDateTime.now().plusDays(7);

        // user_id unique 제약이 있으므로 기존 행이 있으면 갱신하고, 없으면 생성한다.
        refreshTokenRepository.findByUser(user).ifPresentOrElse(existing -> {
            existing.setToken(refreshToken);
            existing.setExpiresAt(expiresAt);
            refreshTokenRepository.save(existing);
        }, () -> {
            RefreshToken token = RefreshToken.builder()
                    .user(user)
                    .token(refreshToken)
                    .expiresAt(expiresAt)
                    .build();
            refreshTokenRepository.save(token);
        });
    }

    /**
     * Refresh Token으로 새 Access Token 발급
     */
    public String refreshAccessToken(String refreshToken) {
        RefreshToken token = refreshTokenRepository.findByToken(refreshToken)
                .orElseThrow(() -> new IllegalArgumentException("유효하지 않은 Refresh Token입니다"));

        if (token.isExpired()) {
            refreshTokenRepository.delete(token);
            throw new IllegalArgumentException("만료된 Refresh Token입니다");
        }

        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw new IllegalArgumentException("유효하지 않은 Refresh Token입니다");
        }

        User user = token.getUser();
        return jwtTokenProvider.generateAccessToken(user.getId(), user.getEmail());
    }

    /**
     * 로그아웃 처리
     */
    public void logout(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다"));

        refreshTokenRepository.deleteByUser(user);
        log.info("User logged out: {}", user.getEmail());
    }

    /**
     * 게스트 로그인 처리
     */
    public LoginResponse guestLogin() {
        User guestUser = userRepository.findByEmail(GUEST_EMAIL)
                .map(existing -> {
                    // 기존 계정이 있어도 이름/활성값은 정책에 맞게 정규화한다.
                    existing.setUsername(GUEST_USERNAME);
                    existing.setIsActive(true);
                    return existing;
                })
                .orElseGet(() -> {
                    User created = User.builder()
                            .username(GUEST_USERNAME)
                            .email(GUEST_EMAIL)
                            .password(passwordEncoder.encode("guest_password"))
                            .isActive(true)
                            .build();

                    Optional<Role> userRole = roleRepository.findByRoleType(Role.RoleType.ROLE_USER);
                    userRole.ifPresent(created::addRole);
                    return created;
                });

        User savedGuestUser = userRepository.save(guestUser);

        // JWT 토큰 생성
        String accessToken = jwtTokenProvider.generateAccessToken(savedGuestUser.getId(), savedGuestUser.getEmail());
        String refreshToken = jwtTokenProvider.generateRefreshToken(savedGuestUser.getId(), savedGuestUser.getEmail());

        // Refresh Token 저장
        saveRefreshToken(savedGuestUser, refreshToken);

        log.info("Guest user created and logged in: {}", savedGuestUser.getEmail());

        return LoginResponse.of(
                savedGuestUser.getId(),
                savedGuestUser.getUsername(),
                savedGuestUser.getEmail(),
                accessToken,
                refreshToken,
                jwtTokenProvider.getAccessTokenExpiration()
        );
    }
}
