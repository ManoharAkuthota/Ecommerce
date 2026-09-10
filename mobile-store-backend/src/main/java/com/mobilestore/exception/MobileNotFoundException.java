package com.mobilestore.exception;

import java.util.UUID;

/**
 * MobileNotFoundException
 * Thrown when a mobile device is requested by ID but does not exist in the database.
 */
public class MobileNotFoundException extends ResourceNotFoundException {

    public MobileNotFoundException(UUID id) {
        super("Mobile", "id", id);
    }

    public MobileNotFoundException(String message) {
        super(message);
    }
}
