package com.learnpath.user.service;

import com.learnpath.exception.ResourceNotFoundException;
import com.learnpath.user.dto.UserResponse;
import com.learnpath.user.entity.User;
import com.learnpath.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

/**
 * Service for user retrieval and profile operations.
 *
 * <p>Authentication-specific logic (register, login) lives in
 * {@link com.learnpath.auth.service.AuthService}.
 */
@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Returns the {@link UserResponse} for a given user ID.
     *
     * @param userId the user's UUID
     * @throws ResourceNotFoundException if no user exists with that ID
     */
    @Transactional(readOnly = true)
    public UserResponse getUserById(UUID userId) {
        User user = userRepository.findByIdWithRoles(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        return UserResponse.from(user);
    }

    /**
     * Returns the {@link UserResponse} for a given email address.
     *
     * @param email the user's email
     * @throws ResourceNotFoundException if no user exists with that email
     */
    @Transactional(readOnly = true)
    public UserResponse getUserByEmail(String email) {
        User user = userRepository.findByEmailWithRoles(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        return UserResponse.from(user);
    }

    /**
     * Loads the raw {@link User} entity — intended for internal service use only.
     *
     * @param userId the user's UUID
     * @throws ResourceNotFoundException if no user exists with that ID
     */
    @Transactional(readOnly = true)
    public User loadUserEntity(UUID userId) {
        return userRepository.findByIdWithRoles(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
    }
}
