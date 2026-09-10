package com.mobilestore.exception;

/**
 * InvalidStockStatusException
 * Thrown when an unsupported stock status value is supplied during inventory updates.
 * Allowed values: 'In Stock', 'Limited Stock', 'Out of Stock'.
 */
public class InvalidStockStatusException extends BadRequestException {

    public InvalidStockStatusException(String stockStatus) {
        super(String.format(
            "Invalid stock status: '%s'. Allowed values are: 'IN_STOCK', 'LIMITED_STOCK', 'OUT_OF_STOCK'",
            stockStatus
        ));
    }
}
