package com.mobilestore.review.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * ReviewRequest DTO
 * Module: review
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewRequest {

    @NotBlank(message = "Customer name is required")
    @Size(min = 2, max = 100, message = "Customer name must be between 2 and 100 characters")
    private String customerName;

    @Size(max = 500, message = "Customer avatar URL cannot exceed 500 characters")
    private String customerImage;

    @NotBlank(message = "Purchased phone is required")
    @Size(max = 150, message = "Purchased phone cannot exceed 150 characters")
    private String purchasedPhone;

    @NotNull(message = "Rating is required")
    @Min(value = 1, message = "Rating must be at least 1 star")
    @Max(value = 5, message = "Rating cannot exceed 5 stars")
    private Integer rating;

    @NotBlank(message = "Review text is required")
    @Size(min = 5, max = 2000, message = "Review text must be between 5 and 2000 characters")
    private String reviewText;
}
