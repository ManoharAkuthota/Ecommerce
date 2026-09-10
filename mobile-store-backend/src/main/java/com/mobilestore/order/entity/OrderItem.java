package com.mobilestore.order.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.mobilestore.mobile.entity.Mobile;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * OrderItem JPA Entity
 * Module: order
 * Maps to 'order_items' table. Represents an individual smartphone line item
 * preserved with snapshot specifications and unit price at checkout time.
 */
@Entity
@Table(
        name = "order_items",
        indexes = {
                @Index(name = "idx_order_items_order_id", columnList = "order_id"),
                @Index(name = "idx_order_items_mobile_id", columnList = "mobile_id")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"order", "mobile"})
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @JdbcTypeCode(SqlTypes.VARCHAR)
    @Column(name = "id", updatable = false, nullable = false, length = 36)
    @EqualsAndHashCode.Include
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    @JsonBackReference
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mobile_id")
    private Mobile mobile;

    @NotNull
    @Column(name = "mobile_name", nullable = false, length = 150)
    private String mobileName;

    @NotNull
    @Column(name = "mobile_brand", nullable = false, length = 50)
    private String mobileBrand;

    @Column(name = "mobile_image", length = 500)
    private String mobileImage;

    @Column(name = "ram", length = 20)
    private String ram;

    @Column(name = "storage", length = 20)
    private String storage;

    @NotNull
    @Column(name = "unit_price", nullable = false, precision = 12, scale = 2)
    private BigDecimal unitPrice;

    @NotNull
    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @NotNull
    @Column(name = "total_price", nullable = false, precision = 12, scale = 2)
    private BigDecimal totalPrice;
}
