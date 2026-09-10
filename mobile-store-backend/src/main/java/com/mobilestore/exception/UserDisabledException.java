package com.mobilestore.exception;

/**
 * UserDisabledException
 * Module: exception
 * Thrown when an authentication attempt is made for a disabled or suspended customer account.
 */
public class UserDisabledException extends RuntimeException {

    public UserDisabledException(String message) {
        super(message);
    }

    public UserDisabledException(String message, Throwable cause) {
        super(message, cause);
    }
}
