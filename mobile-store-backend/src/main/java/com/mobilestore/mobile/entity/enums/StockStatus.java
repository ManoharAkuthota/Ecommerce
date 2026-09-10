package com.mobilestore.mobile.entity.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import com.mobilestore.exception.InvalidStockStatusException;

/**
 * StockStatus
 * Module: mobile
 * Represents product inventory availability states:
 * - IN_STOCK: Product is available for immediate order.
 * - LIMITED_STOCK: Low inventory remaining.
 * - OUT_OF_STOCK: Inventory exhausted.
 */
public enum StockStatus {
    IN_STOCK("In Stock"),
    LIMITED_STOCK("Limited Stock"),
    OUT_OF_STOCK("Out of Stock");

    private final String displayName;

    StockStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    @JsonValue
    public String toValue() {
        return name();
    }

    @JsonCreator
    public static StockStatus fromString(String value) {
        if (value == null || value.isBlank()) {
            throw new InvalidStockStatusException("empty");
        }

        String normalized = value.trim().toUpperCase().replace(" ", "_").replace("-", "_");
        for (StockStatus status : values()) {
            if (status.name().equals(normalized) || status.getDisplayName().equalsIgnoreCase(value.trim())) {
                return status;
            }
        }

        throw new InvalidStockStatusException(value.trim());
    }
}
