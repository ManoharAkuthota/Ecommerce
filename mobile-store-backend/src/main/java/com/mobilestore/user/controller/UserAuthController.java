package com.mobilestore.user.controller;

import com.mobilestore.user.dto.UserLoginRequest;
import com.mobilestore.user.dto.UserLoginResponse;
import com.mobilestore.user.dto.UserRegisterRequest;
import com.mobilestore.user.dto.UserRegisterResponse;
import com.mobilestore.user.service.UserAuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * UserAuthController
 * Module: user
 * Public authentication controller handling customer registration and sign-in.
 */
@RestController
@RequestMapping("/api/auth")
public class UserAuthController {

    private final UserAuthService userAuthService;

    public UserAuthController(UserAuthService userAuthService) {
        this.userAuthService = userAuthService;
    }

    /**
     * Customer registration endpoint.
     * POST /api/auth/register
     */
    @PostMapping("/register")
    public ResponseEntity<UserRegisterResponse> register(@Valid @RequestBody UserRegisterRequest request) {
        UserRegisterResponse response = userAuthService.register(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * Customer login endpoint.
     * POST /api/auth/login
     */
    @PostMapping("/login")
    public ResponseEntity<UserLoginResponse> login(@Valid @RequestBody UserLoginRequest request) {
        UserLoginResponse response = userAuthService.login(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Storefront visitor guest live chat session.
     * POST /api/auth/guest-session
     */
    @PostMapping("/guest-session")
    public ResponseEntity<UserLoginResponse> guestSession(@RequestBody(required = false) com.mobilestore.user.dto.GuestSessionRequest request) {
        UserLoginResponse response = userAuthService.createGuestSession(request != null ? request : new com.mobilestore.user.dto.GuestSessionRequest());
        return ResponseEntity.ok(response);
    }
}
