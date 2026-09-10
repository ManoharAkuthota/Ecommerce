package com.mobilestore.admin.controller;

import com.mobilestore.admin.dto.AdminLoginRequest;
import com.mobilestore.admin.dto.AdminLoginResponse;
import com.mobilestore.admin.service.AdminService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * AdminController
 * Module: admin
 * REST Controller exposing administrative authentication and profile endpoints.
 */
@Slf4j
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    /**
     * Constructor injection for AdminService.
     */
    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    /**
     * POST /api/admin/login
     * Authenticate administrative credentials and return authentication response.
     * Prepares for JWT token issuance in upcoming steps.
     *
     * @param request Validated admin login credentials
     * @return HTTP 200 with AdminLoginResponse DTO
     */
    @PostMapping("/login")
    public ResponseEntity<AdminLoginResponse> login(@Valid @RequestBody AdminLoginRequest request) {
        log.info("REST request to authenticate admin with email: {}", request.getEmail());
        AdminLoginResponse response = adminService.login(request);
        return ResponseEntity.ok(response);
    }
}
