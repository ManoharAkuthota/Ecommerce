package com.mobilestore.order.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * OrderItemResponse
 * Module: order
 * Representation of an individual purchased smartphone within an order invoice.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemResponse {
    private UUID id;
    private UUID mobileId;
    private String mobileName;
    private String mobileBrand;
    private String mobileImage;
    private String ram;
    private String storage;
    private BigDecimal unitPrice;
    private Integer quantity;
    private BigDecimal totalPrice;
}
