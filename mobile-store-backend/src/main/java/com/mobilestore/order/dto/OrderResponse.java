package com.mobilestore.order.dto;

import com.mobilestore.order.entity.enums.DeliveryType;
import com.mobilestore.order.entity.enums.OrderStatus;
import com.mobilestore.order.entity.enums.PaymentMethod;
import com.mobilestore.order.entity.enums.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * OrderResponse
 * Module: order
 * Complete order invoice and live tracking data model for customer and admin portals.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderResponse {
    private UUID id;
    private String orderNumber;
    private UUID customerId;
    private String customerName;
    private String customerEmail;
    private OrderStatus orderStatus;
    private PaymentStatus paymentStatus;
    private PaymentMethod paymentMethod;
    private DeliveryType deliveryType;
    private String paymentTransactionId;

    private BigDecimal subtotal;
    private BigDecimal taxAmount;
    private BigDecimal shippingFee;
    private BigDecimal discountAmount;
    private BigDecimal totalAmount;

    // Recipient & Address Details
    private ShippingAddressDto shippingAddress;

    // Carrier Tracking
    private String trackingNumber;
    private String carrier;
    private String notes;

    // Line Items
    @Builder.Default
    private List<OrderItemResponse> items = new ArrayList<>();

    // Timestamps & Estimated Delivery
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime estimatedDeliveryDate;
}
