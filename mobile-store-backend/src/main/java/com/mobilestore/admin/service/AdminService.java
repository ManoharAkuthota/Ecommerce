package com.mobilestore.admin.service;

import com.mobilestore.admin.dto.AdminLoginRequest;
import com.mobilestore.admin.dto.AdminLoginResponse;
import com.mobilestore.admin.dto.AdminResponse;

/**
 * AdminService
 * Module: admin
 * Service contract for administrative authentication and profile lookup operations.
 */
public interface AdminService {

    /**
     * Authenticate an admin user with email and password.
     *
     * @param request Validated login credentials
     * @return AdminLoginResponse containing authentication metadata
     */
    AdminLoginResponse login(AdminLoginRequest request);

    /**
     * Find an administrative account by email address.
     *
     * @param email Admin email address
     * @return AdminResponse profile DTO
     */
    AdminResponse findByEmail(String email);

    /**
     * Check whether an administrative account exists for the given email address.
     *
     * @param email Admin email address
     * @return true if exists, false otherwise
     */
    boolean existsByEmail(String email);
}
