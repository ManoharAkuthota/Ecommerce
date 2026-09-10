package com.mobilestore.exception;

import org.springframework.security.core.AuthenticationException;

/**
 * InvalidCredentialsException
 * Module: exception
 * Custom domain exception thrown when authentication fails due to invalid credentials.
 */
public class InvalidCredentialsException extends AuthenticationException {

    public InvalidCredentialsException(String message) {
        super(message);
    }

    public InvalidCredentialsException(String message, Throwable cause) {
        super(message, cause);
    }
}
