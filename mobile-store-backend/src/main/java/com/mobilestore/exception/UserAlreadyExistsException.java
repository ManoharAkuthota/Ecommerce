package com.mobilestore.exception;

/**
 * UserAlreadyExistsException
 * Module: exception
 * Thrown when an account registration attempt uses an already registered email address.
 */
public class UserAlreadyExistsException extends RuntimeException {

    public UserAlreadyExistsException(String message) {
        super(message);
    }

    public UserAlreadyExistsException(String message, Throwable cause) {
        super(message, cause);
    }
}
