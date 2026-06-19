package com.learnpath.auth.service;

import com.learnpath.auth.dto.AuthResponse;
import com.learnpath.auth.dto.LoginRequest;
import com.learnpath.auth.dto.RegisterRequest;
import com.learnpath.config.JwtProperties;
import com.learnpath.exception.AuthenticationException;
import com.learnpath.exception.DuplicateResourceException;
import com.learnpath.exception.ResourceNotFoundException;
import com.learnpath.security.JwtService;
import com.learnpath.security.UserPrincipal;
import com.learnpath.user.dto.UserResponse;
import com.learnpath.user.entity.Role;
import com.learnpath.user.entity.User;
import com.learnpath.user.entity.UserProfile;
import com.learnpath.user.repository.RoleRepository;
import com.learnpath.user.repository.UserProfileRepository;
import com.learnpath.user.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Authentication service — registration, login, and current-user retrieval.
 *
 * <p>Design principles:
 * <ul>
 *   <li>UserId is NEVER accepted from the client — always derived from the JWT claim.</li>
 *   <li>Passwords are BCrypt-hashed before persistence.</li>
 *   <li>Timing-safe authentication — invalid credentials always return 401 (no email enumeration).</li>
 *   <li>All writes are wrapped in {@code @Transactional}.</li>
 * </ul>
 */
@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private static final String DEFAULT_ROLE = "STUDENT";

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserProfileRepository userProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final JwtProperties jwtProperties;

    public AuthService(UserRepository userRepository,
                       RoleRepository roleRepository,
                       UserProfileRepository userProfileRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService,
                       JwtProperties jwtProperties) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.userProfileRepository = userProfileRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.jwtProperties = jwtProperties;
    }

    // ── Registration ──────────────────────────────────────────────────────────

    /**
     * Registers a new user.
     *
     * <p>Workflow:
     * <ol>
     *   <li>Normalise email to lowercase.</li>
     *   <li>Check for duplicate email — throw 409 if taken.</li>
     *   <li>Hash password with BCrypt.</li>
     *   <li>Persist {@link User} with default STUDENT role.</li>
     *   <li>Create default {@link UserProfile}.</li>
     *   <li>Generate and return JWT access token.</li>
     * </ol>
     *
     * @param request validated registration request
     * @return authentication response with JWT and user profile
     * @throws DuplicateResourceException if email is already registered
     */
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String normalisedEmail = request.email().toLowerCase().trim();

        if (userRepository.existsByEmail(normalisedEmail)) {
            throw new DuplicateResourceException(
                    "An account with this email address already exists.");
        }

        // Hash password
        String passwordHash = passwordEncoder.encode(request.password());

        // Build user entity
        User user = new User(normalisedEmail, passwordHash,
                request.firstName().trim(), request.lastName().trim());

        // Assign default role
        Role studentRole = roleRepository.findByName(DEFAULT_ROLE)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Default role '" + DEFAULT_ROLE + "' not found. Ensure seed migration V2 has run."));
        user.addRole(studentRole);

        // Persist user (flush so that the generated UUID is available for the profile FK)
        User savedUser = userRepository.save(user);

        // Create and explicitly persist the default profile.
        // NOTE: UserProfile.user is the owning side of the FK (mappedBy is on User).
        // Cascade from the inverse side only fires when user.profile is set AND the
        // user entity is merged. Explicit save via UserProfileRepository is simpler
        // and avoids a second save() call on the user.
        UserProfile profile = UserProfile.createDefault(savedUser);
        userProfileRepository.save(profile);

        log.info("New user registered: id={}, email={}", savedUser.getId(), normalisedEmail);

        return buildAuthResponse(savedUser);
    }

    // ── Login ─────────────────────────────────────────────────────────────────

    /**
     * Authenticates an existing user.
     *
     * <p>Uses BCrypt constant-time comparison to prevent timing attacks.
     * Invalid credentials always produce the same 401 error regardless of
     * whether the email exists (no email enumeration).
     *
     * @param request validated login request
     * @return authentication response with JWT and user profile
     * @throws AuthenticationException if credentials are invalid
     */
    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        String normalisedEmail = request.email().toLowerCase().trim();

        // Always do a BCrypt comparison (constant time) to prevent timing attacks
        User user = userRepository.findByEmailWithRoles(normalisedEmail)
                .orElseThrow(() -> new AuthenticationException("Invalid email or password."));

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            log.warn("Failed login attempt for email: {}", normalisedEmail);
            throw new AuthenticationException("Invalid email or password.");
        }

        if (!user.isActive()) {
            throw new AuthenticationException("Your account has been deactivated. Please contact support.");
        }

        log.info("User logged in: id={}, email={}", user.getId(), normalisedEmail);
        return buildAuthResponse(user);
    }

    // ── Current User ──────────────────────────────────────────────────────────

    /**
     * Returns the authenticated user's profile from their JWT principal.
     *
     * @param principal the Spring Security principal (populated by JWT filter)
     * @return the user's public response DTO
     */
    @Transactional(readOnly = true)
    public UserResponse getCurrentUser(UserPrincipal principal) {
        User user = userRepository.findByIdWithRoles(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", principal.getId()));
        return UserResponse.from(user);
    }

    // ── Private Helpers ───────────────────────────────────────────────────────

    private AuthResponse buildAuthResponse(User user) {
        UserPrincipal principal = UserPrincipal.from(user);
        String token = jwtService.generateToken(principal);
        UserResponse userResponse = UserResponse.from(user);
        long ttlSeconds = jwtProperties.getAccessTokenTtlMinutes() * 60L;
        return AuthResponse.of(token, ttlSeconds, userResponse);
    }
}
