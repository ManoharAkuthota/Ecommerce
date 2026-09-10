package com.mobilestore.admin.service.impl;

import com.mobilestore.admin.dto.AdminLoginRequest;
import com.mobilestore.admin.dto.AdminLoginResponse;
import com.mobilestore.admin.dto.AdminResponse;
import com.mobilestore.admin.entity.Admin;
import com.mobilestore.admin.repository.AdminRepository;
import com.mobilestore.admin.service.AdminService;
import com.mobilestore.exception.ResourceNotFoundException;
import com.mobilestore.security.JwtService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

/**
 * AdminServiceImpl
 * Module: admin
 * Enterprise implementation of the AdminService interface.
 * Handles admin authentication via Spring Security AuthenticationManager,
 * BCrypt credential verification, JWT token issuance, and administrative lookups.
 */
@Slf4j
@Service
@Transactional(readOnly = true)
public class AdminServiceImpl implements AdminService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Constructor injection for required security and repository dependencies.
     */
    public AdminServiceImpl(
            AuthenticationManager authenticationManager,
            JwtService jwtService,
            AdminRepository adminRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public AdminLoginResponse login(AdminLoginRequest request) {
        String email = request.getEmail() != null ? request.getEmail().trim() : "";
        log.info("Attempting admin login for email: {}", email);

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, request.getPassword())
            );
            log.debug("AuthenticationManager successfully authenticated: {}", authentication.getName());
        } catch (AuthenticationException ex) {
            log.warn("Login failed for email: {} - Reason: {}", email, ex.getMessage());
            throw new BadCredentialsException("Invalid email or password");
        }

        Admin admin = adminRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> {
                    log.warn("Authenticated admin record not found in database for email: {}", email);
                    return new BadCredentialsException("Invalid email or password");
                });

        String token = jwtService.generateToken(admin.getEmail());
        Date expirationDate = jwtService.extractExpiration(token);
        LocalDateTime expiresAt = LocalDateTime.ofInstant(
                expirationDate.toInstant(),
                ZoneId.systemDefault()
        );

        log.info("Admin login successful for: {} ({})", admin.getEmail(), admin.getName());

        return mapToLoginResponse(admin, token, expiresAt);
    }

    @Override
    public AdminResponse findByEmail(String email) {
        log.debug("Looking up admin by email: {}", email);
        Admin admin = adminRepository.findByEmailIgnoreCase(email.trim())
                .orElseThrow(() -> new ResourceNotFoundException("Admin", "email", email));
        return mapToResponse(admin);
    }

    @Override
    public boolean existsByEmail(String email) {
        return adminRepository.existsByEmailIgnoreCase(email.trim());
    }

    /**
     * Reusable mapping from Admin entity to AdminResponse profile DTO.
     */
    private AdminResponse mapToResponse(Admin admin) {
        return AdminResponse.builder()
                .id(admin.getId())
                .name(admin.getName())
                .email(admin.getEmail())
                .createdAt(admin.getCreatedAt())
                .updatedAt(admin.getUpdatedAt())
                .build();
    }

    /**
     * Reusable mapping from Admin entity to AdminLoginResponse authentication DTO.
     */
    private AdminLoginResponse mapToLoginResponse(Admin admin, String token, LocalDateTime expiresAt) {
        return AdminLoginResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .adminName(admin.getName())
                .email(admin.getEmail())
                .expiresAt(expiresAt)
                .build();
    }
}
