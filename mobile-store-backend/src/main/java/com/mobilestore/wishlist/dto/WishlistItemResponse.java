package com.mobilestore.wishlist.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * WishlistItemResponse DTO
 * Module: wishlist
 * Represents a single smartphone saved within a customer's wishlist.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WishlistItemResponse {

    private UUID mobileId;

    private String name;

    private String brand;

    private BigDecimal price;

    private String formattedPrice;

    private String firstImage;

    private String ram;

    private String storage;

    private String stock;

    private LocalDateTime addedDate;
}
