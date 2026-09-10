package com.mobilestore.exception;

/**
 * ImageUploadException
 * Thrown when an image file fails validation or Cloudinary processing.
 */
public class ImageUploadException extends CloudinaryUploadException {

    public ImageUploadException(String message) {
        super(message);
    }

    public ImageUploadException(String message, Throwable cause) {
        super(message, cause);
    }
}
