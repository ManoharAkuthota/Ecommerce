package com.mobilestore.user.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * ProfileResponse DTO
 * Module: user
 * Represents the customer profile details returned by GET and PUT /api/account/profile.
 * Supports both modern naming and legacy field aliases for maximum compatibility.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ProfileResponse {

    private UUID id;

    private String name;

    private String fullName;

    private String email;

    private String phone;

    private String phoneNumber;

    private String profileImage;

    private LocalDateTime createdDate;

    private LocalDateTime createdAt;

    private String role;

    private boolean enabled;

    private boolean emailVerified;
}
