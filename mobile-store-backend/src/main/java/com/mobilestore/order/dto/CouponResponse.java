package com.mobilestore.order.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * CouponResponse
 * Module: order
 * Result of promo code validation containing calculated discount.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CouponResponse {
    private boolean valid;
    private String code;
    private String description;
    private BigDecimal discountAmount;
    private String message;
}
