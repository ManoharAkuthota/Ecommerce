package com.mobilestore.user.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * UserLoginResponse
 * Module: user
 * Response payload returned upon successful customer authentication.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserLoginResponse {

    private String token;
    @Builder.Default
    private String tokenType = "Bearer";
    private UUID id;
    private String fullName;
    private String email;
    private String role;
    private LocalDateTime expiresAt;
}
