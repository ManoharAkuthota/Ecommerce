package com.mobilestore.compare.entity;

import com.mobilestore.mobile.entity.Mobile;
import com.mobilestore.user.entity.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * CompareItem JPA Entity
 * Module: compare
 * Maps to the 'compare_items' table. Connects a customer User to a compared Mobile smartphone.
 * Enforces a unique constraint on (user_id, mobile_id) to prevent duplicate compare items.
 * Maximum of 4 items per customer enforced in business logic.
 */
@Entity
@Table(
        name = "compare_items",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_compare_items_user_mobile",
                        columnNames = {"user_id", "mobile_id"}
                )
        },
        indexes = {
                @Index(name = "idx_compare_user_id", columnList = "user_id"),
                @Index(name = "idx_compare_mobile_id", columnList = "mobile_id"),
                @Index(name = "idx_compare_created_at", columnList = "created_at")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"user", "mobile"})
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class CompareItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @JdbcTypeCode(SqlTypes.VARCHAR)
    @Column(name = "id", updatable = false, nullable = false, length = 36)
    @EqualsAndHashCode.Include
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "user_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_compare_user")
    )
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "mobile_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_compare_mobile")
    )
    private Mobile mobile;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }
}
