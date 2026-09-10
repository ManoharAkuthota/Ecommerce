package com.mobilestore.stockalert.entity;

import com.mobilestore.mobile.entity.Mobile;
import com.mobilestore.user.entity.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * StockAlert JPA Entity
 * Module: stockalert
 * Maps to 'stock_alerts' table. Stores customer restock alerts for sold-out smartphones.
 */
@Entity
@Table(
        name = "stock_alerts",
        indexes = {
                @Index(name = "idx_stock_alerts_mobile_id", columnList = "mobile_id"),
                @Index(name = "idx_stock_alerts_email", columnList = "email"),
                @Index(name = "idx_stock_alerts_notified", columnList = "notified")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class StockAlert {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @JdbcTypeCode(SqlTypes.VARCHAR)
    @Column(name = "id", updatable = false, nullable = false, length = 36)
    @EqualsAndHashCode.Include
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mobile_id", nullable = false)
    private Mobile mobile;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @NotBlank(message = "Email is required for restock notification")
    @Email(message = "Invalid email format")
    @Column(name = "email", nullable = false, length = 150)
    private String email;

    @Column(name = "phone_number", length = 30)
    private String phoneNumber;

    @Column(name = "notified", nullable = false)
    @Builder.Default
    private boolean notified = false;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "notified_at")
    private LocalDateTime notifiedAt;
}
