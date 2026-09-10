package com.mobilestore.user.service;

import com.mobilestore.user.dto.ProfileResponse;
import org.springframework.web.multipart.MultipartFile;

/**
 * UserProfileService
 * Module: user
 * Business service contract managing customer profile retrieval, personal info updates,
 * Cloudinary profile picture uploads, and avatar lifecycle management.
 */
public interface UserProfileService {

    /**
     * Retrieve customer profile details by authenticated account email.
     *
     * @param email Authenticated customer email address
     * @return ProfileResponse containing personal details and avatar URL
     */
    ProfileResponse getProfile(String email);

    /**
     * Update customer personal profile attributes with optional Cloudinary avatar replacement or removal.
     *
     * @param email Authenticated customer email address
     * @param fullName Updated customer full name
     * @param phoneNumber Updated phone number
     * @param removeImage Flag indicating whether to delete the existing profile picture
     * @param imageFile Optional new avatar image file (JPG, PNG, WEBP, <= 5 MB)
     * @return ProfileResponse representing the persisted state
     */
    ProfileResponse updateProfile(
            String email,
            String fullName,
            String phoneNumber,
            boolean removeImage,
            MultipartFile imageFile
    );
}
