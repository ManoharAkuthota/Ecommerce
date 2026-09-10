package com.mobilestore.user.service.impl;

import com.mobilestore.exception.InvalidCredentialsException;
import com.mobilestore.exception.ResourceNotFoundException;
import com.mobilestore.exception.UserAlreadyExistsException;
import com.mobilestore.exception.UserDisabledException;
import com.mobilestore.security.JwtService;
import com.mobilestore.user.dto.UserLoginRequest;
import com.mobilestore.user.dto.UserLoginResponse;
import com.mobilestore.user.dto.UserProfileResponse;
import com.mobilestore.user.dto.UserRegisterRequest;
import com.mobilestore.user.dto.UserRegisterResponse;
import com.mobilestore.user.entity.User;
import com.mobilestore.user.entity.UserRole;
import com.mobilestore.user.repository.UserRepository;
import com.mobilestore.user.service.UserAuthService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import com.mobilestore.user.dto.GuestSessionRequest;

/**
 * UserAuthServiceImpl
 * Module: user
 * Production-ready implementation of customer authentication and registration service.
 * Follows Spring Security 6 best practices:
 * - BCrypt password hashing
 * - Stateless JWT issuance with user claims
 * - Defensive transaction boundaries
 * - SLF4J audit logging without exposing sensitive data
 */
@Slf4j
@Service
public class UserAuthServiceImpl implements UserAuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public UserAuthServiceImpl(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Override
    @Transactional
    public UserRegisterResponse register(UserRegisterRequest request) {
        String cleanEmail = request.getEmail().trim().toLowerCase();
        String cleanFullName = request.getFullName().trim();
        String cleanPhone = request.getPhoneNumber().trim();

        log.info("Processing customer registration request for email: {}", cleanEmail);

        if (userRepository.existsByEmailIgnoreCase(cleanEmail)) {
            log.warn("Registration rejected — email already exists: {}", cleanEmail);
            throw new UserAlreadyExistsException("An account with this email address already exists");
        }

        // Hash password with BCrypt
        String encodedPassword = passwordEncoder.encode(request.getPassword());

        User user = User.builder()
                .fullName(cleanFullName)
                .email(cleanEmail)
                .password(encodedPassword)
                .phoneNumber(cleanPhone)
                .role(UserRole.ROLE_USER)
                .enabled(true)
                .emailVerified(false)
                .build();

        User savedUser = userRepository.save(user);

        log.info("Customer registration successful for userId: {} and email: {}", savedUser.getId(), savedUser.getEmail());

        return UserRegisterResponse.builder()
                .id(savedUser.getId())
                .fullName(savedUser.getFullName())
                .email(savedUser.getEmail())
                .phoneNumber(savedUser.getPhoneNumber())
                .role(savedUser.getRole().name())
                .message("Registration successful. Please log in with your credentials.")
                .createdAt(savedUser.getCreatedAt())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public UserLoginResponse login(UserLoginRequest request) {
        String cleanEmail = request.getEmail().trim().toLowerCase();
        log.info("Attempting customer login for email: {}", cleanEmail);

        User user = userRepository.findByEmailIgnoreCase(cleanEmail)
                .orElseThrow(() -> {
                    log.warn("Login failed — customer account not found for email: {}", cleanEmail);
                    return new InvalidCredentialsException("Invalid email or password");
                });

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            log.warn("Login failed — invalid password credentials for customer: {}", cleanEmail);
            throw new InvalidCredentialsException("Invalid email or password");
        }

        if (!user.isEnabled()) {
            log.warn("Login rejected — customer account disabled for email: {}", cleanEmail);
            throw new UserDisabledException("Account has been disabled. Please contact customer support.");
        }

        // Generate stateless JWT token with user claims
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", user.getId().toString());
        claims.put("role", user.getRole().name());

        String token = jwtService.generateToken(claims, user.getEmail());
        Date expirationDate = jwtService.extractExpiration(token);
        LocalDateTime expiresAt = LocalDateTime.ofInstant(
                expirationDate.toInstant(),
                ZoneId.systemDefault()
        );

        log.info("Customer login successful for email: {} ({})", user.getEmail(), user.getFullName());

        return UserLoginResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .expiresAt(expiresAt)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public UserProfileResponse getCurrentUser(String email) {
        String cleanEmail = email.trim().toLowerCase();
        log.debug("Fetching customer profile for: {}", cleanEmail);

        User user = userRepository.findByEmailIgnoreCase(cleanEmail)
                .orElseThrow(() -> {
                    log.warn("Customer profile lookup failed — user not found for: {}", cleanEmail);
                    return new ResourceNotFoundException("User", "email", cleanEmail);
                });

        return UserProfileResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .profileImage(user.getProfileImage())
                .role(user.getRole().name())
                .enabled(user.isEnabled())
                .emailVerified(user.isEmailVerified())
                .createdAt(user.getCreatedAt())
                .build();
    }

    @Override
    @Transactional
    public UserLoginResponse createGuestSession(GuestSessionRequest request) {
        String fullName = (request != null && request.getFullName() != null && !request.getFullName().isBlank())
                ? request.getFullName().trim()
                : "Store Visitor";

        String cleanEmail = (request != null && request.getEmail() != null && !request.getEmail().isBlank())
                ? request.getEmail().trim().toLowerCase()
                : "guest_" + UUID.randomUUID().toString().substring(0, 8) + "@guest.msmobiles.com";

        String cleanPhone = (request != null && request.getPhoneNumber() != null && !request.getPhoneNumber().isBlank())
                ? request.getPhoneNumber().trim()
                : "9999999999";

        log.info("Creating guest live chat session for [{}] ({})", cleanEmail, fullName);

        User user = userRepository.findByEmailIgnoreCase(cleanEmail)
                .orElseGet(() -> {
                    User newUser = User.builder()
                            .fullName(fullName)
                            .email(cleanEmail)
                            .password(passwordEncoder.encode(UUID.randomUUID().toString()))
                            .phoneNumber(cleanPhone)
                            .role(UserRole.ROLE_USER)
                            .enabled(true)
                            .emailVerified(false)
                            .build();
                    return userRepository.save(newUser);
                });

        // Issue JWT token with standard claims
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", user.getId().toString());
        claims.put("email", user.getEmail());
        claims.put("fullName", user.getFullName());
        claims.put("role", user.getRole().name());

        String token = jwtService.generateToken(claims, user.getEmail());
        Date expiration = jwtService.extractExpiration(token);
        LocalDateTime expiresAt = expiration.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();

        log.info("Guest live chat token generated successfully for [{}]", user.getEmail());

        return UserLoginResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .expiresAt(expiresAt)
                .build();
    }
}
