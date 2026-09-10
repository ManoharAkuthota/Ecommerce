package com.mobilestore.mobile.service;

import com.mobilestore.mobile.dto.ImageUploadResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * CloudinaryService
 * Module: mobile
 * Service contract for Cloudinary media storage, format validation,
 * asset ordering, and remote image deletion.
 */
public interface CloudinaryService {

    /**
     * Upload a single image to Cloudinary with validation and display ordering.
     *
     * @param file Multipart file to upload
     * @param imageOrder Sequential display order (1 to 5)
     * @return ImageUploadResponse containing secure URL, public ID, and order
     */
    ImageUploadResponse uploadImage(MultipartFile file, int imageOrder);

    /**
     * Upload a collection of 1 to 5 images to Cloudinary with automatic ordering.
     *
     * @param files List of multipart image files (1 to 5 items)
     * @return List of ImageUploadResponse objects ordered sequentially
     */
    List<ImageUploadResponse> uploadImages(List<MultipartFile> files);

    /**
     * Delete an image from Cloudinary by its public ID.
     *
     * @param publicId Cloudinary public identifier
     */
    void deleteImage(String publicId);

    /**
     * Extract the Cloudinary public ID from a full Cloudinary secure URL.
     *
     * @param imageUrl Full Cloudinary secure URL
     * @return Extracted public ID (e.g., "antigravity-mobile-store/mobiles/sample")
     */
    String extractPublicId(String imageUrl);
}
