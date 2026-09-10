package com.mobilestore.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * AdminLoginResponse DTO
 * Module: admin
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminLoginResponse {

    private String token;

    @Builder.Default
    private String tokenType = "Bearer";

    private String adminName;

    private String email;

    private LocalDateTime expiresAt;
}
