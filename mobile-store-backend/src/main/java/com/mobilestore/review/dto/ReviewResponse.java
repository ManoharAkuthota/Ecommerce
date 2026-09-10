package com.mobilestore.review.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * ReviewResponse DTO
 * Module: review
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewResponse {

    private UUID id;

    private String customerName;

    private String customerImage;

    private String purchasedPhone;

    private Integer rating;

    private String reviewText;

    private LocalDateTime createdAt;
}
