package com.mobilestore.admin.controller;

import com.mobilestore.admin.dto.CustomerSummaryResponse;
import com.mobilestore.admin.dto.CustomerSummaryResponse.CustomerOrderSummary;
import com.mobilestore.exception.ResourceNotFoundException;
import com.mobilestore.order.entity.Order;
import com.mobilestore.order.entity.OrderItem;
import com.mobilestore.order.entity.enums.OrderStatus;
import com.mobilestore.order.repository.OrderRepository;
import com.mobilestore.user.entity.User;
import com.mobilestore.user.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * AdminCustomerController
 * Module: admin
 * REST controller for administrative customer management, CRM directory,
 * lifetime spend metrics, and customer connect capabilities.
 */
@Slf4j
@RestController
@RequestMapping("/api/admin/customers")
@PreAuthorize("hasRole('ADMIN')")
public class AdminCustomerController {

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;

    public AdminCustomerController(UserRepository userRepository, OrderRepository orderRepository) {
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
    }

    /**
     * GET /api/admin/customers
     * Retrieve all registered customers with aggregate purchase metrics.
     */
    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<List<CustomerSummaryResponse>> getAllCustomers() {
        log.info("REST request by administrator to retrieve all customer profiles and purchase statistics");

        List<User> users = userRepository.findAll();
        List<CustomerSummaryResponse> responses = new ArrayList<>();

        for (User user : users) {
            List<Order> orders = orderRepository.findByUserOrderByCreatedAtDesc(user);
            responses.add(buildCustomerSummary(user, orders, 3));
        }

        // Sort: active buyers with recent activity first, then by registration date
        responses.sort((a, b) -> {
            if (a.getLastOrderDate() != null && b.getLastOrderDate() != null) {
                return b.getLastOrderDate().compareTo(a.getLastOrderDate());
            }
            if (a.getLastOrderDate() != null) return -1;
            if (b.getLastOrderDate() != null) return 1;
            if (a.getCreatedAt() != null && b.getCreatedAt() != null) {
                return b.getCreatedAt().compareTo(a.getCreatedAt());
            }
            return 0;
        });

        return ResponseEntity.ok(responses);
    }

    /**
     * GET /api/admin/customers/{id}
     * Retrieve comprehensive profile and full order history for an individual customer.
     */
    @GetMapping("/{id}")
    @Transactional(readOnly = true)
    public ResponseEntity<CustomerSummaryResponse> getCustomerById(@PathVariable UUID id) {
        log.info("REST request by administrator to inspect customer profile ID [{}]", id);

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));

        List<Order> orders = orderRepository.findByUserOrderByCreatedAtDesc(user);
        CustomerSummaryResponse response = buildCustomerSummary(user, orders, orders.size());

        return ResponseEntity.ok(response);
    }

    /**
     * Helper to compute customer summary and lifetime spend from orders.
     */
    private CustomerSummaryResponse buildCustomerSummary(User user, List<Order> orders, int maxRecentOrders) {
        BigDecimal totalSpent = BigDecimal.ZERO;
        for (Order o : orders) {
            if (o.getOrderStatus() != OrderStatus.CANCELLED && o.getTotalAmount() != null) {
                totalSpent = totalSpent.add(o.getTotalAmount());
            }
        }

        Order latestOrder = orders.isEmpty() ? null : orders.get(0);

        List<CustomerOrderSummary> recentSummaries = orders.stream()
                .limit(maxRecentOrders)
                .map(this::mapToOrderSummary)
                .collect(Collectors.toList());

        return CustomerSummaryResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .profileImage(user.getProfileImage())
                .role(user.getRole() != null ? user.getRole().name() : "ROLE_USER")
                .enabled(user.isEnabled())
                .emailVerified(user.isEmailVerified())
                .createdAt(user.getCreatedAt())
                .ordersCount(orders.size())
                .totalSpent(totalSpent)
                .lastOrderDate(latestOrder != null ? latestOrder.getCreatedAt() : null)
                .lastOrderStatus(latestOrder != null ? latestOrder.getOrderStatus().name() : null)
                .city(latestOrder != null ? latestOrder.getCity() : null)
                .state(latestOrder != null ? latestOrder.getState() : null)
                .shippingAddress(latestOrder != null ? latestOrder.getAddressLine1() : null)
                .recentOrders(recentSummaries)
                .build();
    }

    /**
     * Helper to convert an Order into a CustomerOrderSummary.
     */
    private CustomerOrderSummary mapToOrderSummary(Order order) {
        String primaryPhoneName = null;
        String primaryPhoneImage = null;

        if (order.getItems() != null && !order.getItems().isEmpty()) {
            OrderItem firstItem = order.getItems().get(0);
            primaryPhoneName = firstItem.getMobileName();
            primaryPhoneImage = firstItem.getMobileImage();
        }

        return CustomerOrderSummary.builder()
                .orderId(order.getId())
                .orderNumber(order.getOrderNumber())
                .totalAmount(order.getTotalAmount())
                .orderStatus(order.getOrderStatus() != null ? order.getOrderStatus().name() : "CONFIRMED")
                .paymentStatus(order.getPaymentStatus() != null ? order.getPaymentStatus().name() : "PENDING")
                .deliveryType(order.getDeliveryType() != null ? order.getDeliveryType().name() : "STANDARD_DELIVERY")
                .itemsCount(order.getItems() != null ? order.getItems().size() : 0)
                .createdAt(order.getCreatedAt())
                .primaryPhoneName(primaryPhoneName)
                .primaryPhoneImage(primaryPhoneImage)
                .build();
    }
}
