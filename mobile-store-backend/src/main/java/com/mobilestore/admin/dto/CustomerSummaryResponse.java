package com.mobilestore.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * CustomerSummaryResponse DTO
 * Module: admin
 * Carries customer identity, contact information, lifetime metrics,
 * and recent purchase summaries for store management.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerSummaryResponse {

    private UUID id;
    private String fullName;
    private String email;
    private String phoneNumber;
    private String profileImage;
    private String role;
    private boolean enabled;
    private boolean emailVerified;
    private LocalDateTime createdAt;

    // Aggregated Customer Metrics
    private int ordersCount;
    private BigDecimal totalSpent;
    private LocalDateTime lastOrderDate;
    private String lastOrderStatus;
    private String city;
    private String state;
    private String shippingAddress;

    // Recent orders snippet for quick preview
    private List<CustomerOrderSummary> recentOrders;

    /**
     * Compact summary of a customer's individual order.
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CustomerOrderSummary {
        private UUID orderId;
        private String orderNumber;
        private BigDecimal totalAmount;
        private String orderStatus;
        private String paymentStatus;
        private String deliveryType;
        private int itemsCount;
        private LocalDateTime createdAt;
        private String primaryPhoneName;
        private String primaryPhoneImage;
    }
}
