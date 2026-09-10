package com.mobilestore.order.dto;

import com.mobilestore.order.entity.enums.DeliveryType;
import com.mobilestore.order.entity.enums.PaymentMethod;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

/**
 * CreateOrderRequest
 * Module: order
 * Primary payload for customer checkout submission.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateOrderRequest {

    @NotEmpty(message = "Order must contain at least one item")
    @Valid
    @Builder.Default
    private List<OrderItemRequest> items = new ArrayList<>();

    @NotNull(message = "Shipping address is required")
    @Valid
    private ShippingAddressDto shippingAddress;

    @NotNull(message = "Payment method is required")
    @Builder.Default
    private PaymentMethod paymentMethod = PaymentMethod.UPI;

    @NotNull(message = "Delivery option is required")
    @Builder.Default
    private DeliveryType deliveryType = DeliveryType.STANDARD_DELIVERY;

    private String couponCode;

    private String paymentTransactionId;

    private String notes;
}
