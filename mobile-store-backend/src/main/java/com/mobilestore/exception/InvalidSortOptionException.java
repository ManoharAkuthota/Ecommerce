package com.mobilestore.exception;

/**
 * InvalidSortOptionException
 * Thrown when an unsupported sort directive is passed to sorting or search endpoints.
 * Allowed values: 'normal', 'price_asc', 'price_desc', 'latest'.
 */
public class InvalidSortOptionException extends BadRequestException {

    public InvalidSortOptionException(String sort) {
        super(String.format(
            "Invalid sort option: '%s'. Allowed values are: 'normal', 'price_asc', 'price_desc', 'latest'",
            sort
        ));
    }
}
