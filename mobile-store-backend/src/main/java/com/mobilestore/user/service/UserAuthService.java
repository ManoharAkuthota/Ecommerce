package com.mobilestore.user.service;

import com.mobilestore.user.dto.UserLoginRequest;
import com.mobilestore.user.dto.UserLoginResponse;
import com.mobilestore.user.dto.UserProfileResponse;
import com.mobilestore.user.dto.UserRegisterRequest;
import com.mobilestore.user.dto.UserRegisterResponse;

/**
 * UserAuthService
 * Module: user
 * Service interface contract for customer authentication, account registration,
 * and profile management.
 */
public interface UserAuthService {

    /**
     * Registers a new customer account with BCrypt password hashing.
     */
    UserRegisterResponse register(UserRegisterRequest request);

    /**
     * Authenticates a customer by verifying BCrypt credentials and issuing a signed JWT token.
     */
    UserLoginResponse login(UserLoginRequest request);

    /**
     * Retrieves the profile information for the authenticated customer.
     */
    UserProfileResponse getCurrentUser(String email);

    /**
     * Provisions an instant guest customer session and issues a valid JWT token.
     */
    UserLoginResponse createGuestSession(com.mobilestore.user.dto.GuestSessionRequest request);
}
