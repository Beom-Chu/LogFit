package com.logfit.domain.user.entity;

import com.logfit.common.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

    @Column(nullable = false, unique = true, length = 255)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, length = 50)
    private String nickname;

    @Column(precision = 5, scale = 2)
    private Double heightCm;

    @Column(length = 20)
    private String gender;

    private Integer birthYear;

    @Builder
    public User(String email, String password, String nickname) {
        this.email = email;
        this.password = password;
        this.nickname = nickname;
    }

    public void updateProfile(String nickname, Double heightCm, String gender, Integer birthYear) {
        this.nickname = nickname;
        this.heightCm = heightCm;
        this.gender = gender;
        this.birthYear = birthYear;
    }
}
