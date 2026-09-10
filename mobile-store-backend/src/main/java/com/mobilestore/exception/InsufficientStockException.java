package com.mobilestore.exception;

/**
 * InsufficientStockException
 * Thrown when a customer attempts to purchase a mobile device that is out of stock.
 */
public class InsufficientStockException extends BadRequestException {

    public InsufficientStockException(String message) {
        super(message);
    }
}
