package com.mobilestore.order.controller;

import com.mobilestore.order.dto.OrderResponse;
import com.mobilestore.order.dto.OrderStatusUpdateRequest;
import com.mobilestore.order.entity.enums.OrderStatus;
import com.mobilestore.order.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

/**
 * AdminOrderController
 * Module: order
 * Administrative REST endpoints for store owners to manage fulfillment, track courier dispatch,
 * and review business revenue metrics.
 */
@Slf4j
@RestController
@RequestMapping("/api/admin/orders")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminOrderController {

    private final OrderService orderService;

    /**
     * GET /api/admin/orders
     * Fetch paginated list of all customer orders with optional status filter and text search.
     */
    @GetMapping
    public ResponseEntity<Page<OrderResponse>> getAllOrders(
            @RequestParam(required = false) OrderStatus status,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size) {
        log.info("REST request by admin to list orders: status={}, search={}, page={}, size={}", status, search, page, size);
        Pageable pageable = PageRequest.of(page, size);
        Page<OrderResponse> orders = orderService.getAllOrders(pageable, status, search);
        return ResponseEntity.ok(orders);
    }

    /**
     * GET /api/admin/orders/{id}
     * Inspect single order details.
     */
    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable UUID id) {
        log.info("REST request by admin to inspect order ID: {}", id);
        OrderResponse order = orderService.getOrderById(id);
        return ResponseEntity.ok(order);
    }

    /**
     * PATCH /api/admin/orders/{id}/status
     * Advance order status (e.g. PROCESSING -> SHIPPED -> DELIVERED) and attach tracking number.
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<OrderResponse> updateOrderStatus(
            @PathVariable UUID id,
            @Valid @RequestBody OrderStatusUpdateRequest request) {
        log.info("REST request by admin to update status for order ID: {}", id);
        OrderResponse updated = orderService.updateOrderStatus(id, request);
        return ResponseEntity.ok(updated);
    }

    /**
     * GET /api/admin/orders/metrics
     * Retrieve key operational fulfillment and revenue metrics.
     */
    @GetMapping("/metrics")
    public ResponseEntity<Map<String, Object>> getOrderMetrics() {
        log.info("REST request by admin to fetch order business metrics");
        Map<String, Object> metrics = orderService.getAdminOrderMetrics();
        return ResponseEntity.ok(metrics);
    }
}
