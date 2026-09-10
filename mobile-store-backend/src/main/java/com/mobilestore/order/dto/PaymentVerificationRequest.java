package com.mobilestore.order.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * PaymentVerificationRequest
 * Module: order
 * Payload received after payment gateway callback or simulated QR scan completion.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentVerificationRequest {

    @NotBlank(message = "Transaction ID is required")
    private String transactionId;

    private String paymentId;

    @Builder.Default
    private boolean success = true;
}
