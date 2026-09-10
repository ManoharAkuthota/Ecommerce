package com.mobilestore.stockalert.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

/**
 * StockAlertRequest DTO
 * Module: stockalert
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StockAlertRequest {

    @NotNull(message = "Mobile ID is required")
    private UUID mobileId;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    private String phoneNumber;
}
