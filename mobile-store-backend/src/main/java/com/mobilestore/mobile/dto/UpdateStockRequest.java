package com.mobilestore.mobile.dto;

import com.mobilestore.mobile.entity.enums.StockStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * UpdateStockRequest DTO
 * Module: mobile
 * Dedicated lightweight payload for updating a mobile device's inventory stock status.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateStockRequest {

    @NotNull(message = "Stock status is required")
    private StockStatus stockStatus;
}
