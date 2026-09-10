package com.mobilestore.mobile.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * StockUpdateRequest DTO
 * Module: mobile
 * Dedicated payload for updating a mobile device's inventory stock status.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StockUpdateRequest {

    @NotBlank(message = "Stock status is required")
    @Pattern(
        regexp = "^(?i)(IN_STOCK|LIMITED_STOCK|OUT_OF_STOCK|In Stock|Limited Stock|Out of Stock)$",
        message = "Stock status must be one of: 'IN_STOCK', 'LIMITED_STOCK', 'OUT_OF_STOCK'"
    )
    private String stockStatus;
}
