package com.logfit.domain.user.dto;

import com.logfit.domain.user.entity.User;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
public class UserProfileResponse {
    private final Long userId;
    private final String email;
    private final String nickname;
    private final BigDecimal heightCm;
    private final String gender;
    private final Integer birthYear;

    public UserProfileResponse(User user) {
        this.userId = user.getUserId();
        this.email = user.getEmail();
        this.nickname = user.getNickname();
        this.heightCm = user.getHeightCm();
        this.gender = user.getGender();
        this.birthYear = user.getBirthYear();
    }
}
