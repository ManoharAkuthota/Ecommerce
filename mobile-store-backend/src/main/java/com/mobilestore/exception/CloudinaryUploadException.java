package com.mobilestore.exception;

/**
 * CloudinaryUploadException
 * Module: exception
 * Custom unchecked exception thrown when Cloudinary file validation,
 * upload, or deletion fails.
 */
public class CloudinaryUploadException extends RuntimeException {

    public CloudinaryUploadException(String message) {
        super(message);
    }

    public CloudinaryUploadException(String message, Throwable cause) {
        super(message, cause);
    }
}
