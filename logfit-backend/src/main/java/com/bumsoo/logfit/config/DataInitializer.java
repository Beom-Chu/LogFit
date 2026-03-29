package com.bumsoo.logfit.config;

import com.bumsoo.logfit.entity.ExerciseType;
import com.bumsoo.logfit.entity.Role;
import com.bumsoo.logfit.entity.User;
import com.bumsoo.logfit.repository.ExerciseTypeRepository;
import com.bumsoo.logfit.repository.RoleRepository;
import com.bumsoo.logfit.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private static final String GUEST_USERNAME = "게스트";
    private static final String GUEST_EMAIL = "guest@logfit.local";
    private static final String LEGACY_GUEST_EMAIL_PATTERN = "guest_%@logfit.local";

    @Bean
    public CommandLineRunner initializeData(
            RoleRepository roleRepository,
            ExerciseTypeRepository exerciseTypeRepository,
            UserRepository userRepository
    ) {
        return args -> {
            // 기본 역할 생성
            if (roleRepository.findByRoleType(Role.RoleType.ROLE_USER).isEmpty()) {
                Role userRole = Role.builder()
                        .roleType(Role.RoleType.ROLE_USER)
                        .description("일반 사용자")
                        .build();
                roleRepository.save(userRole);
                log.info("ROLE_USER created");
            }

            if (roleRepository.findByRoleType(Role.RoleType.ROLE_ADMIN).isEmpty()) {
                Role adminRole = Role.builder()
                        .roleType(Role.RoleType.ROLE_ADMIN)
                        .description("관리자")
                        .build();
                roleRepository.save(adminRole);
                log.info("ROLE_ADMIN created");
            }

            // 기본 운동 종류 생성
            List<String> defaultExercises = List.of(
                    "벤치프레스",
                    "스쿼트",
                    "데드리프트",
                    "오버헤드 프레스",
                    "풀업",
                    "바벨 로우",
                    "런지",
                    "레그 프레스"
            );

            for (String exerciseName : defaultExercises) {
                if (!exerciseTypeRepository.existsByIsDefaultTrueAndNameIgnoreCase(exerciseName)) {
                    exerciseTypeRepository.save(ExerciseType.builder()
                            .name(exerciseName)
                            .isDefault(true)
                            .build());
                    log.info("Default exercise created: {}", exerciseName);
                }
            }

            // 레거시 guest_* 계정의 이름을 '게스트'로 정리하고, 표준 guest@logfit.local 계정을 보정한다.
            List<User> legacyGuests = userRepository.findAllByEmailLikeOrderByIdAsc(LEGACY_GUEST_EMAIL_PATTERN);
            legacyGuests.forEach(guest -> {
                guest.setUsername(GUEST_USERNAME);
                if (guest.getIsActive() == null || !guest.getIsActive()) {
                    guest.setIsActive(true);
                }
            });
            if (!legacyGuests.isEmpty()) {
                userRepository.saveAll(legacyGuests);
                log.info("Legacy guest usernames normalized: {}", legacyGuests.size());
            }

            if (userRepository.findByEmail(GUEST_EMAIL).isEmpty() && !legacyGuests.isEmpty()) {
                User canonicalGuest = legacyGuests.get(0);
                canonicalGuest.setEmail(GUEST_EMAIL);
                canonicalGuest.setUsername(GUEST_USERNAME);
                canonicalGuest.setIsActive(true);
                userRepository.save(canonicalGuest);
                log.info("Canonical guest account prepared: {}", GUEST_EMAIL);
            }
        };
    }
}

