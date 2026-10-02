package com.logfit.common.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {

    // Common
    INVALID_REQUEST(HttpStatus.BAD_REQUEST, "INVALID_REQUEST", "잘못된 요청입니다."),
    UNAUTHORIZED(HttpStatus.UNAUTHORIZED, "UNAUTHORIZED", "인증이 필요합니다."),
    FORBIDDEN(HttpStatus.FORBIDDEN, "FORBIDDEN", "권한이 없습니다."),
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "INTERNAL_SERVER_ERROR", "서버 오류가 발생했습니다."),

    // Auth
    EMAIL_ALREADY_EXISTS(HttpStatus.CONFLICT, "EMAIL_ALREADY_EXISTS", "이미 사용 중인 이메일입니다."),
    INVALID_CREDENTIALS(HttpStatus.UNAUTHORIZED, "INVALID_CREDENTIALS", "이메일 또는 비밀번호가 올바르지 않습니다."),
    INVALID_TOKEN(HttpStatus.UNAUTHORIZED, "INVALID_TOKEN", "유효하지 않은 토큰입니다."),

    // User
    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "USER_NOT_FOUND", "사용자를 찾을 수 없습니다."),

    // Exercise
    EXERCISE_NOT_FOUND(HttpStatus.NOT_FOUND, "EXERCISE_NOT_FOUND", "운동을 찾을 수 없습니다."),
    EXERCISE_MODIFY_FORBIDDEN(HttpStatus.FORBIDDEN, "EXERCISE_MODIFY_FORBIDDEN", "기본 제공 운동은 수정/삭제할 수 없습니다."),
    FAVORITE_ALREADY_EXISTS(HttpStatus.CONFLICT, "FAVORITE_ALREADY_EXISTS", "이미 즐겨찾기에 추가된 운동입니다."),
    FAVORITE_NOT_FOUND(HttpStatus.NOT_FOUND, "FAVORITE_NOT_FOUND", "즐겨찾기에 없는 운동입니다."),

    // Workout Session
    SESSION_NOT_FOUND(HttpStatus.NOT_FOUND, "SESSION_NOT_FOUND", "운동 세션을 찾을 수 없습니다."),
    SESSION_STATUS_INVALID(HttpStatus.BAD_REQUEST, "SESSION_STATUS_INVALID", "현재 상태에서 허용되지 않는 작업입니다."),

    // Body Weight
    WEIGHT_NOT_FOUND(HttpStatus.NOT_FOUND, "WEIGHT_NOT_FOUND", "체중 기록을 찾을 수 없습니다."),
    WEIGHT_ALREADY_EXISTS(HttpStatus.CONFLICT, "WEIGHT_ALREADY_EXISTS", "해당 날짜의 체중 기록이 이미 존재합니다."),

    // Body Composition
    BODY_COMPOSITION_NOT_FOUND(HttpStatus.NOT_FOUND, "BODY_COMPOSITION_NOT_FOUND", "체성분 기록을 찾을 수 없습니다."),
    BODY_COMPOSITION_ALREADY_EXISTS(HttpStatus.CONFLICT, "BODY_COMPOSITION_ALREADY_EXISTS", "해당 날짜의 체성분 기록이 이미 존재합니다.");

    private final HttpStatus httpStatus;
    private final String code;
    private final String message;

    ErrorCode(HttpStatus httpStatus, String code, String message) {
        this.httpStatus = httpStatus;
        this.code = code;
        this.message = message;
    }
}
