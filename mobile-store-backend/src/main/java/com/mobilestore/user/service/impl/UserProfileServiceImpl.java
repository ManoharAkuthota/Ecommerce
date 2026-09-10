package com.mobilestore.user.service.impl;

import com.mobilestore.exception.ResourceNotFoundException;
import com.mobilestore.mobile.dto.ImageUploadResponse;
import com.mobilestore.mobile.service.CloudinaryService;
import com.mobilestore.user.dto.ProfileResponse;
import com.mobilestore.user.entity.User;
import com.mobilestore.user.repository.UserRepository;
import com.mobilestore.user.service.UserProfileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

/**
 * UserProfileServiceImpl
 * Module: user
 * Implementation of UserProfileService managing profile retrieval, text updates,
 * Cloudinary image uploads, and asset cleanup.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class UserProfileServiceImpl implements UserProfileService {

    private final UserRepository userRepository;
    private final CloudinaryService cloudinaryService;

    @Override
    @Transactional(readOnly = true)
    public ProfileResponse getProfile(String email) {
        log.info("Fetching customer profile for email: '{}'", email);

        User user = userRepository.findByEmailIgnoreCase(email != null ? email.trim() : "")
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        return mapToProfileResponse(user);
    }

    @Override
    @Transactional
    public ProfileResponse updateProfile(
            String email,
            String fullName,
            String phoneNumber,
            boolean removeImage,
            MultipartFile imageFile
    ) {
        log.info("Updating customer profile for email: '{}', removeImage={}, hasImageFile={}",
                email, removeImage, (imageFile != null && !imageFile.isEmpty()));

        User user = userRepository.findByEmailIgnoreCase(email != null ? email.trim() : "")
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        // 1. Validate and update Full Name
        if (fullName != null) {
            String trimmedName = fullName.trim();
            if (trimmedName.length() < 2 || trimmedName.length() > 100) {
                throw new IllegalArgumentException("Full name must be between 2 and 100 characters");
            }
            user.setFullName(trimmedName);
        }

        // 2. Validate and update Phone Number
        if (phoneNumber != null) {
            String trimmedPhone = phoneNumber.trim();
            if (trimmedPhone.isEmpty() || trimmedPhone.length() > 30) {
                throw new IllegalArgumentException("Phone number must be between 1 and 30 characters");
            }
            user.setPhoneNumber(trimmedPhone);
        }

        // 3. Handle Cloudinary Avatar Upload or Removal
        if (imageFile != null && !imageFile.isEmpty()) {
            log.info("Uploading replacement profile image to Cloudinary for customer: '{}'", email);
            ImageUploadResponse uploadResponse = cloudinaryService.uploadImage(imageFile, 1);

            // Clean up existing Cloudinary asset if previously stored
            cleanupOldAvatar(user.getProfileImage());

            user.setProfileImage(uploadResponse.getImageUrl());
            log.info("Profile image updated to: '{}'", uploadResponse.getImageUrl());

        } else if (removeImage) {
            log.info("Removing profile image for customer: '{}'", email);
            cleanupOldAvatar(user.getProfileImage());
            user.setProfileImage(null);
        }

        User savedUser = userRepository.save(user);
        log.info("Successfully persisted profile updates for customer: '{}'", email);

        return mapToProfileResponse(savedUser);
    }

    /**
     * Clean up a previous Cloudinary avatar asset if it matches the Cloudinary URL format.
     */
    private void cleanupOldAvatar(String oldImageUrl) {
        if (oldImageUrl == null || oldImageUrl.isBlank()) {
            return;
        }

        try {
            String publicId = cloudinaryService.extractPublicId(oldImageUrl);
            if (publicId != null && !publicId.isBlank()) {
                log.info("Deleting obsolete profile asset from Cloudinary: '{}'", publicId);
                cloudinaryService.deleteImage(publicId);
            }
        } catch (Exception e) {
            log.warn("Failed to clean up old profile image '{}': {}", oldImageUrl, e.getMessage());
            // Do not break execution for remote asset deletion failure
        }
    }

    /**
     * Map User JPA Entity to ProfileResponse DTO with unified naming.
     */
    private ProfileResponse mapToProfileResponse(User user) {
        return ProfileResponse.builder()
                .id(user.getId())
                .name(user.getFullName())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhoneNumber())
                .phoneNumber(user.getPhoneNumber())
                .profileImage(user.getProfileImage())
                .createdDate(user.getCreatedAt())
                .createdAt(user.getCreatedAt())
                .role(user.getRole() != null ? user.getRole().name() : "ROLE_USER")
                .enabled(user.isEnabled())
                .emailVerified(user.isEmailVerified())
                .build();
    }
}
