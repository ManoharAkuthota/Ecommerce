package com.mobilestore.user.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * UserRegisterResponse
 * Module: user
 * Response payload returned upon successful customer registration.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserRegisterResponse {

    private UUID id;
    private String fullName;
    private String email;
    private String phoneNumber;
    private String role;
    private String message;
    private LocalDateTime createdAt;
}
