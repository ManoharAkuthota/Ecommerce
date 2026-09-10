package com.mobilestore.user.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * UserProfileResponse
 * Module: user
 * Response payload representing the authenticated customer's profile.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileResponse {

    private UUID id;
    private String fullName;
    private String email;
    private String phoneNumber;
    private String profileImage;
    private String role;
    private boolean enabled;
    private boolean emailVerified;
    private LocalDateTime createdAt;
}
