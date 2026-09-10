package com.mobilestore.order.service.impl;

import com.mobilestore.chat.entity.ChatMessage;
import com.mobilestore.chat.repository.ChatMessageRepository;
import com.mobilestore.exception.BadRequestException;
import com.mobilestore.exception.InsufficientStockException;
import com.mobilestore.exception.MobileNotFoundException;
import com.mobilestore.exception.OrderNotFoundException;
import com.mobilestore.mobile.entity.Mobile;
import com.mobilestore.mobile.entity.enums.StockStatus;
import com.mobilestore.mobile.repository.MobileRepository;
import com.mobilestore.order.dto.*;
import com.mobilestore.order.entity.Order;
import com.mobilestore.order.entity.OrderItem;
import com.mobilestore.order.entity.enums.DeliveryType;
import com.mobilestore.order.entity.enums.OrderStatus;
import com.mobilestore.order.entity.enums.PaymentMethod;
import com.mobilestore.order.entity.enums.PaymentStatus;
import com.mobilestore.order.repository.OrderRepository;
import com.mobilestore.order.service.OrderService;
import com.mobilestore.user.entity.User;
import com.mobilestore.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * OrderServiceImpl
 * Module: order
 * Core implementation of order checkout, payment lifecycle, inventory verification,
 * invoice calculation, and fulfillment management.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final MobileRepository mobileRepository;
    private final UserRepository userRepository;
    private final ChatMessageRepository chatMessageRepository;

    private static final BigDecimal FREE_SHIPPING_THRESHOLD = new BigDecimal("5000.00");
    private static final BigDecimal STANDARD_SHIPPING_FEE = new BigDecimal("199.00");
    private static final BigDecimal GST_RATE = new BigDecimal("0.18");

    @Override
    @Transactional
    public OrderResponse createOrder(String customerEmail, CreateOrderRequest request) {
        log.info("Processing checkout order for customer: {}", customerEmail);

        User user = userRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new BadRequestException("Customer account not found: " + customerEmail));

        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new BadRequestException("Cannot create an order with an empty items list.");
        }

        Order order = new Order();
        order.setUser(user);
        order.setDeliveryType(request.getDeliveryType() != null ? request.getDeliveryType() : DeliveryType.STANDARD_DELIVERY);
        order.setPaymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : PaymentMethod.UPI);
        order.setOrderStatus(OrderStatus.CONFIRMED);
        order.setNotes(request.getNotes());

        // Recipient details
        ShippingAddressDto addr = request.getShippingAddress();
        order.setRecipientName(addr.getFullName());
        order.setRecipientPhone(addr.getPhoneNumber());
        order.setRecipientEmail(addr.getEmail());
        order.setAddressLine1(addr.getAddressLine1());
        order.setAddressLine2(addr.getAddressLine2());
        order.setCity(addr.getCity());
        order.setState(addr.getState());
        order.setPostalCode(addr.getPostalCode());

        // Process line items & check stock
        BigDecimal subtotal = BigDecimal.ZERO;
        List<OrderItem> lineItems = new ArrayList<>();

        for (OrderItemRequest itemReq : request.getItems()) {
            Mobile mobile = mobileRepository.findById(itemReq.getMobileId())
                    .orElseThrow(() -> new MobileNotFoundException(itemReq.getMobileId()));

            if (mobile.getStockStatus() == StockStatus.OUT_OF_STOCK) {
                throw new InsufficientStockException("Smartphone '" + mobile.getName() + "' is currently OUT OF STOCK.");
            }

            BigDecimal unitPrice = mobile.getPrice();
            BigDecimal itemTotal = unitPrice.multiply(BigDecimal.valueOf(itemReq.getQuantity()));
            subtotal = subtotal.add(itemTotal);

            // First image fallback
            String firstImage = null;
            if (mobile.getImages() != null && !mobile.getImages().isEmpty()) {
                firstImage = mobile.getImages().get(0).getImageUrl();
            }

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .mobile(mobile)
                    .mobileName(mobile.getName())
                    .mobileBrand(mobile.getBrand())
                    .mobileImage(firstImage)
                    .ram(mobile.getRam())
                    .storage(mobile.getStorage())
                    .unitPrice(unitPrice)
                    .quantity(itemReq.getQuantity())
                    .totalPrice(itemTotal)
                    .build();

            lineItems.add(orderItem);
        }

        order.setItems(lineItems);
        order.setSubtotal(subtotal);

        // Calculate GST amount (18% for invoice breakdown)
        BigDecimal taxAmount = subtotal.multiply(GST_RATE).setScale(2, RoundingMode.HALF_UP);
        order.setTaxAmount(taxAmount);

        // Calculate shipping fee
        BigDecimal shippingFee = BigDecimal.ZERO;
        if (order.getDeliveryType() != DeliveryType.STORE_PICKUP && subtotal.compareTo(FREE_SHIPPING_THRESHOLD) < 0) {
            shippingFee = STANDARD_SHIPPING_FEE;
        }
        order.setShippingFee(shippingFee);

        // Apply discount coupon if present
        BigDecimal discountAmount = BigDecimal.ZERO;
        if (request.getCouponCode() != null && !request.getCouponCode().isBlank()) {
            CouponResponse coupon = validateCoupon(request.getCouponCode(), subtotal);
            if (coupon.isValid()) {
                discountAmount = coupon.getDiscountAmount();
            }
        }
        order.setDiscountAmount(discountAmount);

        // Calculate final total
        BigDecimal totalAmount = subtotal.subtract(discountAmount).add(shippingFee);
        if (totalAmount.compareTo(BigDecimal.ZERO) < 0) {
            totalAmount = BigDecimal.ZERO;
        }
        order.setTotalAmount(totalAmount);

        // Set payment status and transaction reference
        if (order.getPaymentMethod() == PaymentMethod.COD) {
            order.setPaymentStatus(PaymentStatus.PENDING);
        } else {
            order.setPaymentStatus(PaymentStatus.PAID);
            String txId = request.getPaymentTransactionId();
            if (txId == null || txId.isBlank()) {
                txId = "TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
            }
            order.setPaymentTransactionId(txId);
        }

        // Generate unique order number: MS-2026-XXXXX
        order.setOrderNumber(generateUniqueOrderNumber());

        Order saved = orderRepository.save(order);
        log.info("Order successfully placed with OrderNumber: {}, Total: INR {}", saved.getOrderNumber(), saved.getTotalAmount());

        String itemsSummary = saved.getItems().stream()
                .map(i -> i.getQuantity() + "x " + i.getMobileName())
                .collect(Collectors.joining(", "));

        postOrderNotificationToChat(
                saved,
                "📦 Order Confirmed: #" + saved.getOrderNumber(),
                "Thank you for choosing MS Mobiles! Your order for " + itemsSummary + " (Total: ₹" + saved.getTotalAmount() + ") has been verified and confirmed. Inventory is allocated and scheduled for security packaging."
        );

        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponse> getCustomerOrders(String customerEmail) {
        log.info("Fetching orders for customer: {}", customerEmail);
        User user = userRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new BadRequestException("Customer account not found: " + customerEmail));

        return orderRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponse getCustomerOrderById(String customerEmail, UUID orderId) {
        log.info("Fetching order {} for customer: {}", orderId, customerEmail);
        User user = userRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new BadRequestException("Customer account not found: " + customerEmail));

        Order order = orderRepository.findByIdAndUser(orderId, user)
                .orElseThrow(() -> new OrderNotFoundException(orderId));

        return mapToResponse(order);
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponse getOrderByOrderNumber(String orderNumber) {
        log.info("Lookup order by order number: {}", orderNumber);
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new OrderNotFoundException("Order not found with reference: " + orderNumber));

        return mapToResponse(order);
    }

    @Override
    @Transactional
    public OrderResponse verifyPayment(UUID orderId, PaymentVerificationRequest request) {
        log.info("Verifying payment for order ID {}: txId={}", orderId, request.getTransactionId());
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException(orderId));

        if (request.isSuccess()) {
            order.setPaymentStatus(PaymentStatus.PAID);
            order.setPaymentTransactionId(request.getTransactionId());
            if (order.getOrderStatus() == OrderStatus.PENDING) {
                order.setOrderStatus(OrderStatus.CONFIRMED);
            }
        } else {
            order.setPaymentStatus(PaymentStatus.FAILED);
        }

        Order updated = orderRepository.save(order);
        return mapToResponse(updated);
    }

    @Override
    @Transactional
    public OrderResponse cancelOrder(String customerEmail, UUID orderId, String reason) {
        log.info("Customer {} requesting cancellation of order {}", customerEmail, orderId);
        User user = userRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new BadRequestException("Customer account not found: " + customerEmail));

        Order order = orderRepository.findByIdAndUser(orderId, user)
                .orElseThrow(() -> new OrderNotFoundException(orderId));

        if (order.getOrderStatus() == OrderStatus.SHIPPED || order.getOrderStatus() == OrderStatus.DELIVERED) {
            throw new BadRequestException("Cannot cancel an order that has already been shipped or delivered.");
        }

        order.setOrderStatus(OrderStatus.CANCELLED);
        if (reason != null && !reason.isBlank()) {
            String existingNotes = order.getNotes() != null ? order.getNotes() + " | " : "";
            order.setNotes(existingNotes + "Cancelled by customer: " + reason);
        }

        Order cancelled = orderRepository.save(order);

        postOrderNotificationToChat(
                cancelled,
                "❌ Order Cancelled: #" + cancelled.getOrderNumber(),
                "Your cancellation request has been confirmed. " + (reason != null && !reason.isBlank() ? "Reason: " + reason : "")
        );

        return mapToResponse(cancelled);
    }

    @Override
    public CouponResponse validateCoupon(String code, BigDecimal subtotal) {
        if (code == null || code.isBlank() || subtotal == null) {
            return CouponResponse.builder()
                    .valid(false)
                    .message("Invalid coupon code")
                    .discountAmount(BigDecimal.ZERO)
                    .build();
        }

        String normalized = code.trim().toUpperCase();

        switch (normalized) {
            case "WELCOME500":
                return CouponResponse.builder()
                        .valid(true)
                        .code(normalized)
                        .description("Flat ₹500 off on your order")
                        .discountAmount(new BigDecimal("500.00"))
                        .message("WELCOME500 applied: ₹500 instant discount!")
                        .build();

            case "MSFESTIVE":
                if (subtotal.compareTo(new BigDecimal("50000.00")) >= 0) {
                    return CouponResponse.builder()
                            .valid(true)
                            .code(normalized)
                            .description("Festive special ₹2,000 off on orders above ₹50,000")
                            .discountAmount(new BigDecimal("2000.00"))
                            .message("MSFESTIVE applied: ₹2,000 festive savings!")
                            .build();
                } else {
                    return CouponResponse.builder()
                            .valid(false)
                            .code(normalized)
                            .description("Requires minimum order value of ₹50,000")
                            .discountAmount(BigDecimal.ZERO)
                            .message("MSFESTIVE requires a minimum cart value of ₹50,000")
                            .build();
                }

            case "FLAGSHIP1000":
                if (subtotal.compareTo(new BigDecimal("25000.00")) >= 0) {
                    return CouponResponse.builder()
                            .valid(true)
                            .code(normalized)
                            .description("₹1,000 discount on flagship phones")
                            .discountAmount(new BigDecimal("1000.00"))
                            .message("FLAGSHIP1000 applied: ₹1,000 instant discount!")
                            .build();
                } else {
                    return CouponResponse.builder()
                            .valid(false)
                            .code(normalized)
                            .description("Requires minimum order value of ₹25,000")
                            .discountAmount(BigDecimal.ZERO)
                            .message("FLAGSHIP1000 requires a minimum cart value of ₹25,000")
                            .build();
                }

            default:
                return CouponResponse.builder()
                        .valid(false)
                        .code(normalized)
                        .message("Coupon code '" + normalized + "' is invalid or expired.")
                        .discountAmount(BigDecimal.ZERO)
                        .build();
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Page<OrderResponse> getAllOrders(Pageable pageable, OrderStatus status, String search) {
        log.info("Admin fetching orders: status={}, search={}", status, search);

        Page<Order> ordersPage;
        if (search != null && !search.isBlank()) {
            ordersPage = orderRepository.searchOrders(search.trim(), pageable);
        } else if (status != null) {
            ordersPage = orderRepository.findByOrderStatusOrderByCreatedAtDesc(status, pageable);
        } else {
            ordersPage = orderRepository.findAllByOrderByCreatedAtDesc(pageable);
        }

        return ordersPage.map(this::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponse getOrderById(UUID orderId) {
        log.info("Admin fetching order by ID: {}", orderId);
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException(orderId));
        return mapToResponse(order);
    }

    @Override
    @Transactional
    public OrderResponse updateOrderStatus(UUID orderId, OrderStatusUpdateRequest request) {
        log.info("Admin updating status for order {}: newStatus={}", orderId, request.getOrderStatus());
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException(orderId));

        order.setOrderStatus(request.getOrderStatus());

        if (request.getPaymentStatus() != null) {
            order.setPaymentStatus(request.getPaymentStatus());
        }

        if (request.getTrackingNumber() != null && !request.getTrackingNumber().isBlank()) {
            order.setTrackingNumber(request.getTrackingNumber().trim());
        }

        if (request.getCarrier() != null && !request.getCarrier().isBlank()) {
            order.setCarrier(request.getCarrier().trim());
        }

        if (request.getNotes() != null && !request.getNotes().isBlank()) {
            order.setNotes(request.getNotes().trim());
        }

        Order updated = orderRepository.save(order);

        String trackingInfo = (updated.getTrackingNumber() != null && !updated.getTrackingNumber().isBlank())
                ? " (Carrier: " + (updated.getCarrier() != null && !updated.getCarrier().isBlank() ? updated.getCarrier() : "Blue Dart Express") + " | AWB: " + updated.getTrackingNumber() + ")"
                : "";

        String stageTitle;
        String stageDesc;
        switch (updated.getOrderStatus()) {
            case PROCESSING:
                stageTitle = "⚙️ Order Update: #" + updated.getOrderNumber() + " is now PROCESSING";
                stageDesc = "Quality inspection passed and IMEI numbers verified. Sealed in tamper-evident security packaging at Cyber Hills Fulfillment Center.";
                break;
            case SHIPPED:
                stageTitle = "🚚 Order Dispatched: #" + updated.getOrderNumber() + " is IN TRANSIT";
                stageDesc = "Handed over to logistics carrier" + trackingInfo + ". Please keep your 4-digit Delivery Handover OTP ready for courier verification.";
                break;
            case DELIVERED:
                stageTitle = "✅ Order Delivered: #" + updated.getOrderNumber() + " DELIVERED";
                stageDesc = "Package successfully delivered to " + updated.getRecipientName() + ". Handover OTP verified. Official 1-Year brand warranty is now active!";
                break;
            case CANCELLED:
                stageTitle = "❌ Order Cancelled: #" + updated.getOrderNumber() + " CANCELLED";
                stageDesc = "Order cancellation completed. Any pre-authorized charges will be refunded to your original payment method within 3-5 business days.";
                break;
            default:
                stageTitle = "📋 Order Milestone: #" + updated.getOrderNumber() + " updated to " + updated.getOrderStatus();
                stageDesc = "Order status updated in our fulfillment network.";
                break;
        }
        postOrderNotificationToChat(updated, stageTitle, stageDesc);

        return mapToResponse(updated);
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getAdminOrderMetrics() {
        log.info("Computing administrative order metrics");
        long totalOrders = orderRepository.count();
        long pendingOrders = orderRepository.countByOrderStatus(OrderStatus.CONFIRMED) + orderRepository.countByOrderStatus(OrderStatus.PENDING);
        long processingOrders = orderRepository.countByOrderStatus(OrderStatus.PROCESSING);
        long shippedOrders = orderRepository.countByOrderStatus(OrderStatus.SHIPPED);
        long deliveredOrders = orderRepository.countByOrderStatus(OrderStatus.DELIVERED);
        long cancelledOrders = orderRepository.countByOrderStatus(OrderStatus.CANCELLED);
        BigDecimal totalRevenue = orderRepository.calculateTotalRevenue();

        return Map.of(
                "totalOrders", totalOrders,
                "pendingOrders", pendingOrders,
                "processingOrders", processingOrders,
                "shippedOrders", shippedOrders,
                "deliveredOrders", deliveredOrders,
                "cancelledOrders", cancelledOrders,
                "totalRevenue", totalRevenue != null ? totalRevenue : BigDecimal.ZERO
        );
    }

    // =========================================================================
    // Helpers
    // =========================================================================

    private String generateUniqueOrderNumber() {
        String orderNumber;
        Random random = new Random();
        do {
            int randomNum = 10000 + random.nextInt(90000);
            orderNumber = "MS-2026-" + randomNum;
        } while (orderRepository.findByOrderNumber(orderNumber).isPresent());
        return orderNumber;
    }

    private OrderResponse mapToResponse(Order order) {
        List<OrderItemResponse> itemResponses = order.getItems().stream()
                .map(item -> OrderItemResponse.builder()
                        .id(item.getId())
                        .mobileId(item.getMobile() != null ? item.getMobile().getId() : null)
                        .mobileName(item.getMobileName())
                        .mobileBrand(item.getMobileBrand())
                        .mobileImage(item.getMobileImage())
                        .ram(item.getRam())
                        .storage(item.getStorage())
                        .unitPrice(item.getUnitPrice())
                        .quantity(item.getQuantity())
                        .totalPrice(item.getTotalPrice())
                        .build())
                .collect(Collectors.toList());

        ShippingAddressDto addressDto = ShippingAddressDto.builder()
                .fullName(order.getRecipientName())
                .phoneNumber(order.getRecipientPhone())
                .email(order.getRecipientEmail())
                .addressLine1(order.getAddressLine1())
                .addressLine2(order.getAddressLine2())
                .city(order.getCity())
                .state(order.getState())
                .postalCode(order.getPostalCode())
                .build();

        LocalDateTime estimatedDelivery = order.getDeliveryType() == DeliveryType.STORE_PICKUP
                ? order.getCreatedAt()
                : order.getCreatedAt().plusDays(3);

        return OrderResponse.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .customerId(order.getUser() != null ? order.getUser().getId() : null)
                .customerName(order.getUser() != null ? order.getUser().getFullName() : order.getRecipientName())
                .customerEmail(order.getUser() != null ? order.getUser().getEmail() : order.getRecipientEmail())
                .orderStatus(order.getOrderStatus())
                .paymentStatus(order.getPaymentStatus())
                .paymentMethod(order.getPaymentMethod())
                .deliveryType(order.getDeliveryType())
                .paymentTransactionId(order.getPaymentTransactionId())
                .subtotal(order.getSubtotal())
                .taxAmount(order.getTaxAmount())
                .shippingFee(order.getShippingFee())
                .discountAmount(order.getDiscountAmount())
                .totalAmount(order.getTotalAmount())
                .shippingAddress(addressDto)
                .trackingNumber(order.getTrackingNumber())
                .carrier(order.getCarrier())
                .notes(order.getNotes())
                .items(itemResponses)
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .estimatedDeliveryDate(estimatedDelivery)
                .build();
    }

    private void postOrderNotificationToChat(Order order, String stageTitle, String stageDetails) {
        try {
            if (order == null || order.getUser() == null) {
                return;
            }
            String deliveryNotice = order.getDeliveryType() == DeliveryType.STORE_PICKUP
                    ? "Showroom Counter Pickup (Cyber Hills)"
                    : "Express Doorstep Delivery";

            String trackingLine = (order.getTrackingNumber() != null && !order.getTrackingNumber().isBlank())
                    ? String.format("Carrier: %s | AWB: %s\n",
                    (order.getCarrier() != null && !order.getCarrier().isBlank() ? order.getCarrier() : "Blue Dart Express"),
                    order.getTrackingNumber())
                    : "";

            String fullMessage = String.format("%s\n\n%s\n\n%sOrder Reference: #%s\nDelivery Mode: %s\nStatus: %s",
                    stageTitle,
                    stageDetails,
                    trackingLine,
                    order.getOrderNumber(),
                    deliveryNotice,
                    order.getOrderStatus()
            );

            ChatMessage chatMsg = ChatMessage.builder()
                    .user(order.getUser())
                    .senderRole("ADMIN")
                    .senderName("MS Logistics Bot")
                    .senderEmail("concierge@mobilestore.com")
                    .channel("TRACKING")
                    .message(fullMessage)
                    .isReadByCustomer(false)
                    .isReadByAdmin(true)
                    .build();

            chatMessageRepository.save(chatMsg);
            log.info("Successfully posted order stage chat notification for {}", order.getOrderNumber());
        } catch (Exception e) {
            log.warn("Failed to post order stage notification to chat for order {}: {}", order.getOrderNumber(), e.getMessage());
        }
    }
}
