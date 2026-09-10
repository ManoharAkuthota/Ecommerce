package com.mobilestore.mobile.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * ImageUploadResponse DTO
 * Module: mobile
 * Represents an uploaded Cloudinary asset with its secure URL, public ID, and display order.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ImageUploadResponse {

    private String imageUrl;

    private String publicId;

    private Integer imageOrder;
}
