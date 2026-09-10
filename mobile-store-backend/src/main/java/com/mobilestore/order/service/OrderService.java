package com.mobilestore.order.service;

import com.mobilestore.order.dto.*;
import com.mobilestore.order.entity.enums.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * OrderService
 * Module: order
 * Business logic contract for order placement, payment verification, fulfillment, and metrics.
 */
public interface OrderService {

    /**
     * Customer Checkout: Place a new order with items, shipping details, and payment selection.
     */
    OrderResponse createOrder(String customerEmail, CreateOrderRequest request);

    /**
     * Retrieve all orders for the authenticated customer.
     */
    List<OrderResponse> getCustomerOrders(String customerEmail);

    /**
     * Retrieve single order details for the customer, with security ownership check.
     */
    OrderResponse getCustomerOrderById(String customerEmail, UUID orderId);

    /**
     * Lookup order by readable order number.
     */
    OrderResponse getOrderByOrderNumber(String orderNumber);

    /**
     * Verify payment status (e.g. UPI callback / simulated gateway).
     */
    OrderResponse verifyPayment(UUID orderId, PaymentVerificationRequest request);

    /**
     * Customer cancels a pending order.
     */
    OrderResponse cancelOrder(String customerEmail, UUID orderId, String reason);

    /**
     * Validate promotional coupon code and calculate discount.
     */
    CouponResponse validateCoupon(String code, BigDecimal subtotal);

    /**
     * Admin: Retrieve all customer orders with optional status filter and search query.
     */
    Page<OrderResponse> getAllOrders(Pageable pageable, OrderStatus status, String search);

    /**
     * Admin: Retrieve order by ID.
     */
    OrderResponse getOrderById(UUID orderId);

    /**
     * Admin: Advance order fulfillment status and update tracking details.
     */
    OrderResponse updateOrderStatus(UUID orderId, OrderStatusUpdateRequest request);

    /**
     * Admin: Retrieve order KPI metrics (total orders, total revenue, pending shipments, delivered).
     */
    Map<String, Object> getAdminOrderMetrics();
}
