package com.bumsoo.logfit.service;

import com.bumsoo.logfit.dto.CreateExerciseTypeRequest;
import com.bumsoo.logfit.dto.ExerciseTypeResponse;
import com.bumsoo.logfit.entity.ExerciseType;
import com.bumsoo.logfit.entity.User;
import com.bumsoo.logfit.repository.ExerciseTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ExerciseTypeService {

    private final ExerciseTypeRepository exerciseTypeRepository;

    @Transactional(readOnly = true)
    public List<ExerciseTypeResponse> getAvailableExerciseTypes(User user) {
        return exerciseTypeRepository.findAvailableByUserId(user.getId()).stream()
                .map(ExerciseTypeResponse::from)
                .toList();
    }

    public ExerciseTypeResponse createCustomExerciseType(User user, CreateExerciseTypeRequest request) {
        String normalizedName = request.name().trim();

        boolean duplicatedInMyList = exerciseTypeRepository.existsByCreatedByIdAndNameIgnoreCase(user.getId(), normalizedName);
        boolean duplicatedInDefault = exerciseTypeRepository.existsByIsDefaultTrueAndNameIgnoreCase(normalizedName);
        if (duplicatedInMyList || duplicatedInDefault) {
            throw new IllegalArgumentException("이미 등록한 운동 종류입니다");
        }

        ExerciseType exerciseType = ExerciseType.builder()
                .name(normalizedName)
                .isDefault(false)
                .createdBy(user)
                .build();

        return ExerciseTypeResponse.from(exerciseTypeRepository.save(exerciseType));
    }

    @Transactional(readOnly = true)
    public ExerciseType resolveExerciseTypeForUser(User user, Long exerciseTypeId) {
        ExerciseType exerciseType = exerciseTypeRepository.findById(exerciseTypeId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 운동 종류입니다"));

        boolean isDefault = Boolean.TRUE.equals(exerciseType.getIsDefault());
        boolean isOwnedByUser = exerciseType.getCreatedBy() != null
                && exerciseType.getCreatedBy().getId().equals(user.getId());

        if (!isDefault && !isOwnedByUser) {
            throw new IllegalArgumentException("해당 운동 종류에 접근할 수 없습니다");
        }

        return exerciseType;
    }
}


