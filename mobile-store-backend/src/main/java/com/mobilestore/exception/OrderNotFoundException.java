package com.mobilestore.exception;

import java.util.UUID;

/**
 * OrderNotFoundException
 * Thrown when an order is requested by UUID or order number but does not exist.
 */
public class OrderNotFoundException extends ResourceNotFoundException {

    public OrderNotFoundException(UUID id) {
        super("Order", "id", id);
    }

    public OrderNotFoundException(String message) {
        super(message);
    }
}
