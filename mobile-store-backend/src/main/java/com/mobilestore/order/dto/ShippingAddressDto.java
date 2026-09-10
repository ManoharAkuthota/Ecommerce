package com.mobilestore.order.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * ShippingAddressDto
 * Module: order
 * Validated shipping address payload captured during checkout.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShippingAddressDto {

    @NotBlank(message = "Recipient full name is required")
    @Size(max = 100, message = "Name cannot exceed 100 characters")
    private String fullName;

    @NotBlank(message = "Contact phone number is required")
    @Size(max = 30, message = "Phone number cannot exceed 30 characters")
    private String phoneNumber;

    @NotBlank(message = "Contact email is required")
    @Email(message = "Valid email is required")
    private String email;

    @NotBlank(message = "Street address is required")
    @Size(max = 255, message = "Address cannot exceed 255 characters")
    private String addressLine1;

    private String addressLine2;

    @NotBlank(message = "City is required")
    private String city;

    @NotBlank(message = "State is required")
    private String state;

    @NotBlank(message = "Postal PIN code is required")
    @Size(min = 4, max = 20, message = "Invalid postal code")
    private String postalCode;
}
