package com.mobilestore.exception;

import java.util.UUID;

/**
 * ReviewNotFoundException
 * Thrown when a customer review is requested or targeted for deletion by ID but does not exist.
 */
public class ReviewNotFoundException extends ResourceNotFoundException {

    public ReviewNotFoundException(UUID id) {
        super("Review", "id", id);
    }

    public ReviewNotFoundException(String message) {
        super(message);
    }
}
