package com.mobilestore.order.entity.enums;

/**
 * OrderStatus
 * Module: order
 * Defines the fulfillment lifecycle stages for customer smartphone orders.
 */
public enum OrderStatus {
    PENDING,
    CONFIRMED,
    PROCESSING,
    SHIPPED,
    DELIVERED,
    CANCELLED
}
