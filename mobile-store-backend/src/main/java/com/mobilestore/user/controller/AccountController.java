package com.mobilestore.user.controller;

import com.mobilestore.exception.InvalidCredentialsException;
import com.mobilestore.user.dto.UserProfileResponse;
import com.mobilestore.user.service.UserAuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * AccountController
 * Module: user
 * Protected account management controller providing current customer profile details.
 */
@RestController
@RequestMapping("/api/account")
public class AccountController {

    private final UserAuthService userAuthService;

    public AccountController(UserAuthService userAuthService) {
        this.userAuthService = userAuthService;
    }

    /**
     * Retrieve authenticated customer profile.
     * GET /api/account/me
     */
    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getName())) {
            throw new InvalidCredentialsException("Access denied: Not authenticated");
        }

        String email = authentication.getName();
        UserProfileResponse profile = userAuthService.getCurrentUser(email);
        return ResponseEntity.ok(profile);
    }
}
