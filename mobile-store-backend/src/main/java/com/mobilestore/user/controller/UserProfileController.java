package com.mobilestore.user.controller;

import com.mobilestore.exception.InvalidCredentialsException;
import com.mobilestore.user.dto.ProfileResponse;
import com.mobilestore.user.dto.UpdateProfileRequest;
import com.mobilestore.user.service.UserProfileService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

/**
 * UserProfileController
 * Module: user
 * REST controller for customer profile operations at /api/account/profile.
 * Protected strictly with ROLE_USER.
 */
@Slf4j
@Validated
@RestController
@RequestMapping("/api/account/profile")
@RequiredArgsConstructor
public class UserProfileController {

    private final UserProfileService userProfileService;

    /**
     * Retrieve authenticated customer profile.
     * GET /api/account/profile
     */
    @GetMapping
    public ResponseEntity<ProfileResponse> getProfile(Authentication authentication) {
        verifyCustomerAuth(authentication);

        String email = authentication.getName();
        log.info("GET /api/account/profile called by customer: '{}'", email);

        ProfileResponse profile = userProfileService.getProfile(email);
        return ResponseEntity.ok(profile);
    }

    /**
     * Update customer personal profile with multipart support for photo upload.
     * PUT /api/account/profile (multipart/form-data)
     */
    @PutMapping(consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<ProfileResponse> updateProfileMultipart(
            Authentication authentication,
            @RequestParam("fullName") @NotBlank(message = "Full name is required")
            @Size(min = 2, max = 100, message = "Full name must be between 2 and 100 characters") String fullName,
            @RequestParam("phoneNumber") @NotBlank(message = "Phone number is required")
            @Size(max = 30, message = "Phone number cannot exceed 30 characters") String phoneNumber,
            @RequestParam(value = "removeImage", defaultValue = "false") boolean removeImage,
            @RequestParam(value = "image", required = false) MultipartFile imageFile
    ) {
        verifyCustomerAuth(authentication);

        String email = authentication.getName();
        log.info("PUT /api/account/profile [multipart] called by customer: '{}', removeImage={}", email, removeImage);

        ProfileResponse response = userProfileService.updateProfile(
                email,
                fullName,
                phoneNumber,
                removeImage,
                imageFile
        );

        return ResponseEntity.ok(response);
    }

    /**
     * Update customer personal profile with JSON payload (when no image file is being uploaded).
     * PUT /api/account/profile (application/json)
     */
    @PutMapping(consumes = { MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<ProfileResponse> updateProfileJson(
            Authentication authentication,
            @Valid @RequestBody UpdateProfileRequest request
    ) {
        verifyCustomerAuth(authentication);

        String email = authentication.getName();
        log.info("PUT /api/account/profile [json] called by customer: '{}', removeImage={}", email, request.isRemoveImage());

        ProfileResponse response = userProfileService.updateProfile(
                email,
                request.getFullName(),
                request.getPhoneNumber(),
                request.isRemoveImage(),
                null
        );

        return ResponseEntity.ok(response);
    }

    /**
     * Enforce customer authentication and strict ROLE_USER privilege check.
     */
    private void verifyCustomerAuth(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getName())) {
            throw new InvalidCredentialsException("Access denied: Not authenticated");
        }

        boolean isCustomer = authentication.getAuthorities().stream()
                .anyMatch(a -> "ROLE_USER".equals(a.getAuthority()));

        if (!isCustomer) {
            throw new AccessDeniedException("Access denied: Customer privileges (ROLE_USER) required");
        }
    }
}
