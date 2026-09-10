package com.mobilestore.order.dto;

import com.mobilestore.order.entity.enums.OrderStatus;
import com.mobilestore.order.entity.enums.PaymentStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * OrderStatusUpdateRequest
 * Module: order
 * Payload submitted by store administrators to advance order fulfillment status.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderStatusUpdateRequest {

    @NotNull(message = "Order status is required")
    private OrderStatus orderStatus;

    private PaymentStatus paymentStatus;

    private String trackingNumber;

    private String carrier;

    private String notes;
}
