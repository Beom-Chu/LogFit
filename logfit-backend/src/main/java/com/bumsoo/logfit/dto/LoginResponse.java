package com.bumsoo.logfit.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponse {

    private Long userId;
    private String username;
    private String email;
    private String accessToken;
    private String refreshToken;
    private String tokenType;
    private Long expiresIn;

    public static LoginResponse of(Long userId, String username, String email, String accessToken, String refreshToken, Long expiresIn) {
        return LoginResponse.builder()
                .userId(userId)
                .username(username)
                .email(email)
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(expiresIn)
                .build();
    }
}

