package com.mobilestore.order.controller;

import com.mobilestore.exception.InvalidCredentialsException;
import com.mobilestore.order.dto.*;
import com.mobilestore.order.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * OrderController
 * Module: order
 * Customer-facing REST endpoints for cart checkout, order creation, order tracking,
 * and payment verification.
 */
@Slf4j
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    /**
     * POST /api/orders
     * Customer Checkout: Place a new order with items and shipping address.
     */
    @PostMapping("/orders")
    public ResponseEntity<OrderResponse> createOrder(
            @Valid @RequestBody CreateOrderRequest request,
            Authentication authentication) {
        String email = getAuthenticatedEmail(authentication);
        log.info("REST request by customer [{}] to place order", email);
        OrderResponse response = orderService.createOrder(email, request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * GET /api/account/orders
     * Fetch all past and active orders placed by the authenticated customer.
     */
    @GetMapping("/account/orders")
    public ResponseEntity<List<OrderResponse>> getMyOrders(Authentication authentication) {
        String email = getAuthenticatedEmail(authentication);
        log.info("REST request by customer [{}] to fetch order history", email);
        List<OrderResponse> orders = orderService.getCustomerOrders(email);
        return ResponseEntity.ok(orders);
    }

    /**
     * GET /api/account/orders/{id}
     * Retrieve single order details with itemized invoice and fulfillment tracking.
     */
    @GetMapping("/account/orders/{id}")
    public ResponseEntity<OrderResponse> getMyOrderById(
            @PathVariable UUID id,
            Authentication authentication) {
        String email = getAuthenticatedEmail(authentication);
        log.info("REST request by customer [{}] to fetch order: {}", email, id);
        OrderResponse order = orderService.getCustomerOrderById(email, id);
        return ResponseEntity.ok(order);
    }

    /**
     * GET /api/orders/lookup/{orderNumber}
     * Lookup order by readable order number (e.g. MS-2026-8812).
     */
    @GetMapping("/orders/lookup/{orderNumber}")
    public ResponseEntity<OrderResponse> lookupOrderByNumber(@PathVariable String orderNumber) {
        log.info("Public REST request to lookup order by number: {}", orderNumber);
        OrderResponse order = orderService.getOrderByOrderNumber(orderNumber);
        return ResponseEntity.ok(order);
    }

    /**
     * POST /api/orders/{id}/verify-payment
     * Callback/Simulated payment verification endpoint.
     */
    @PostMapping("/orders/{id}/verify-payment")
    public ResponseEntity<OrderResponse> verifyPayment(
            @PathVariable UUID id,
            @Valid @RequestBody PaymentVerificationRequest request) {
        log.info("REST request to verify payment for order ID: {}", id);
        OrderResponse order = orderService.verifyPayment(id, request);
        return ResponseEntity.ok(order);
    }

    /**
     * POST /api/account/orders/{id}/cancel
     * Cancel an active order if not yet shipped.
     */
    @PostMapping("/account/orders/{id}/cancel")
    public ResponseEntity<OrderResponse> cancelOrder(
            @PathVariable UUID id,
            @RequestBody(required = false) Map<String, String> payload,
            Authentication authentication) {
        String email = getAuthenticatedEmail(authentication);
        String reason = payload != null ? payload.getOrDefault("reason", "Customer requested cancellation") : "Customer cancelled";
        log.info("REST request by customer [{}] to cancel order {}: reason='{}'", email, id, reason);
        OrderResponse response = orderService.cancelOrder(email, id, reason);
        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/orders/coupon/validate
     * Validate promotional coupon code and preview discount amount.
     */
    @PostMapping("/orders/coupon/validate")
    public ResponseEntity<CouponResponse> validateCoupon(@Valid @RequestBody CouponValidateRequest request) {
        log.info("REST request to validate coupon: {}", request.getCode());
        CouponResponse response = orderService.validateCoupon(request.getCode(), request.getSubtotal());
        return ResponseEntity.ok(response);
    }

    private String getAuthenticatedEmail(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getName())) {
            throw new InvalidCredentialsException("Access denied: Authentication required");
        }
        return authentication.getName();
    }
}
