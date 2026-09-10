package com.mobilestore.order.repository;

import com.mobilestore.order.entity.Order;
import com.mobilestore.order.entity.enums.OrderStatus;
import com.mobilestore.user.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * OrderRepository
 * Module: order
 * Spring Data JPA repository for Order persistence and administrative metrics.
 */
@Repository
public interface OrderRepository extends JpaRepository<Order, UUID> {

    List<Order> findByUserOrderByCreatedAtDesc(User user);

    Optional<Order> findByIdAndUser(UUID id, User user);

    Optional<Order> findByOrderNumber(String orderNumber);

    Page<Order> findAllByOrderByCreatedAtDesc(Pageable pageable);

    Page<Order> findByOrderStatusOrderByCreatedAtDesc(OrderStatus status, Pageable pageable);

    long countByOrderStatus(OrderStatus status);

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.paymentStatus = 'PAID' OR o.orderStatus IN ('CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED')")
    BigDecimal calculateTotalRevenue();

    @Query("SELECT o FROM Order o WHERE LOWER(o.orderNumber) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(o.recipientName) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(o.recipientEmail) LIKE LOWER(CONCAT('%', :query, '%')) ORDER BY o.createdAt DESC")
    Page<Order> searchOrders(@Param("query") String query, Pageable pageable);
}
