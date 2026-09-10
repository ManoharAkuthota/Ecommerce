package com.mobilestore.wishlist.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

/**
 * WishlistResponse DTO
 * Module: wishlist
 * Aggregates a customer's active wishlist items and current total item count.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WishlistResponse {

    @Builder.Default
    private List<WishlistItemResponse> items = new ArrayList<>();

    private long count;

    private String message;
}
