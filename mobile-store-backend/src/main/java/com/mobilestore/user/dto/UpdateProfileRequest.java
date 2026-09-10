package com.mobilestore.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * UpdateProfileRequest DTO
 * Module: user
 * Encapsulates the editable personal profile attributes submitted via PUT /api/account/profile.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProfileRequest {

    @NotBlank(message = "Full name is required")
    @Size(min = 2, max = 100, message = "Full name must be between 2 and 100 characters")
    private String fullName;

    @NotBlank(message = "Phone number is required")
    @Size(max = 30, message = "Phone number cannot exceed 30 characters")
    @Pattern(
            regexp = "^[+]?[0-9\\s\\-().]{7,25}$",
            message = "Phone number format is invalid"
    )
    private String phoneNumber;

    @Builder.Default
    private boolean removeImage = false;
}
