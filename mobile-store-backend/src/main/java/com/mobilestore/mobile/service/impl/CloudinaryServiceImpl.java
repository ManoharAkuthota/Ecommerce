package com.mobilestore.mobile.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.mobilestore.exception.CloudinaryUploadException;
import com.mobilestore.mobile.dto.ImageUploadResponse;
import com.mobilestore.mobile.service.CloudinaryService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * CloudinaryServiceImpl
 * Module: mobile
 * Enterprise implementation of CloudinaryService for media asset management.
 * Enforces 1-5 image constraints, 5MB file size limits, MIME type verification,
 * structured folder hierarchy, and remote asset destruction.
 */
@Slf4j
@Service
public class CloudinaryServiceImpl implements CloudinaryService {

    private static final String UPLOAD_FOLDER = "antigravity-mobile-store/mobiles";
    private static final long MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of(
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp"
    );
    private static final Set<String> ALLOWED_EXTENSIONS = Set.of(
            "jpg",
            "jpeg",
            "png",
            "webp"
    );

    // Regex to extract publicId from Cloudinary URL (e.g., .../upload/v1234567/antigravity-mobile-store/mobiles/sample.jpg)
    private static final Pattern PUBLIC_ID_PATTERN = Pattern.compile(
            "/upload/(?:v\\d+/)?(antigravity-mobile-store/mobiles/[^./]+)"
    );

    private final Cloudinary cloudinary;

    /**
     * Constructor injection for Cloudinary bean.
     */
    public CloudinaryServiceImpl(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    @Override
    public ImageUploadResponse uploadImage(MultipartFile file, int imageOrder) {
        log.info("Starting upload for single image (order={}): filename='{}', size={} bytes",
                imageOrder, file.getOriginalFilename(), file.getSize());

        validateFile(file);

        try {
            Map<?, ?> uploadParams = ObjectUtils.asMap(
                    "folder", UPLOAD_FOLDER,
                    "resource_type", "image",
                    "use_filename", false,
                    "unique_filename", true
            );

            Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), uploadParams);

            String secureUrl = (String) uploadResult.get("secure_url");
            String publicId = (String) uploadResult.get("public_id");

            log.info("Cloudinary upload completed: publicId='{}', secureUrl='{}'", publicId, secureUrl);

            return ImageUploadResponse.builder()
                    .imageUrl(secureUrl)
                    .publicId(publicId)
                    .imageOrder(imageOrder)
                    .build();

        } catch (IOException e) {
            log.error("Cloudinary upload failed for file '{}': {}", file.getOriginalFilename(), e.getMessage());
            throw new CloudinaryUploadException("Failed to upload image to Cloudinary: " + e.getMessage(), e);
        }
    }

    @Override
    public List<ImageUploadResponse> uploadImages(List<MultipartFile> files) {
        if (files == null || files.isEmpty()) {
            throw new CloudinaryUploadException("At least one image is required (minimum: 1 image)");
        }

        // Filter out empty multipart placeholders if sent by HTML forms
        List<MultipartFile> validFiles = files.stream()
                .filter(f -> f != null && !f.isEmpty())
                .toList();

        if (validFiles.isEmpty()) {
            throw new CloudinaryUploadException("At least one non-empty image file is required");
        }

        if (validFiles.size() > 5) {
            throw new CloudinaryUploadException("Maximum of 5 images allowed per smartphone (received: " + validFiles.size() + ")");
        }

        log.info("Uploading batch of {} images to folder '{}'", validFiles.size(), UPLOAD_FOLDER);

        List<ImageUploadResponse> uploadedList = new ArrayList<>();
        int order = 1;

        for (MultipartFile file : validFiles) {
            ImageUploadResponse response = uploadImage(file, order++);
            uploadedList.add(response);
        }

        log.info("Successfully uploaded {} images with sequential ordering", uploadedList.size());
        return uploadedList;
    }

    @Override
    public void deleteImage(String publicId) {
        if (publicId == null || publicId.isBlank()) {
            log.warn("Cannot delete image: publicId is null or blank");
            return;
        }

        log.info("Deleting image from Cloudinary with public ID: '{}'", publicId);

        try {
            Map<?, ?> result = cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            log.info("Cloudinary delete result for '{}': {}", publicId, result.get("result"));
        } catch (Exception e) {
            log.error("Error deleting image '{}' from Cloudinary: {}", publicId, e.getMessage());
            // Do not break execution for remote asset deletion failure
        }
    }

    @Override
    public String extractPublicId(String imageUrl) {
        if (imageUrl == null || imageUrl.isBlank()) {
            return null;
        }

        Matcher matcher = PUBLIC_ID_PATTERN.matcher(imageUrl);
        if (matcher.find()) {
            return matcher.group(1);
        }

        // Fallback: search for UPLOAD_FOLDER in URL
        int folderIndex = imageUrl.indexOf(UPLOAD_FOLDER);
        if (folderIndex != -1) {
            String path = imageUrl.substring(folderIndex);
            int dotIndex = path.lastIndexOf('.');
            return dotIndex != -1 ? path.substring(0, dotIndex) : path;
        }

        return null;
    }

    // =========================================================================
    // File Validation Helpers
    // =========================================================================

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new CloudinaryUploadException("Cannot upload an empty image file");
        }

        // Size check: <= 5 MB
        if (file.getSize() > MAX_FILE_SIZE_BYTES) {
            throw new CloudinaryUploadException(String.format(
                    "File '%s' exceeds the maximum allowed size of 5 MB (actual: %.2f MB)",
                    file.getOriginalFilename(), (double) file.getSize() / (1024 * 1024)
            ));
        }

        // MIME Type check
        String contentType = file.getContentType();
        if (contentType != null && !ALLOWED_CONTENT_TYPES.contains(contentType.toLowerCase())) {
            throw new CloudinaryUploadException(String.format(
                    "Invalid file type '%s'. Supported formats are JPG, JPEG, PNG, and WEBP.",
                    contentType
            ));
        }

        // File Extension check
        String originalFilename = file.getOriginalFilename();
        if (originalFilename != null && originalFilename.contains(".")) {
            String extension = originalFilename.substring(originalFilename.lastIndexOf('.') + 1).toLowerCase();
            if (!ALLOWED_EXTENSIONS.contains(extension)) {
                throw new CloudinaryUploadException(String.format(
                        "Invalid file extension '.%s'. Supported formats are JPG, JPEG, PNG, and WEBP.",
                        extension
                ));
            }
        }
    }
}
