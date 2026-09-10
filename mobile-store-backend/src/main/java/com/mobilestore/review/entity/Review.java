package com.mobilestore.review.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Review JPA Entity
 * Module: review
 * Maps to 'reviews' table. Stores authentic customer product testimonials, ratings (1 to 5),
 * customer avatar links, and purchased phone specifications.
 */
@Entity
@Table(name = "reviews")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @JdbcTypeCode(SqlTypes.VARCHAR)
    @Column(name = "id", updatable = false, nullable = false, length = 36)
    @EqualsAndHashCode.Include
    private UUID id;

    @NotBlank(message = "Customer name is required")
    @Size(min = 2, max = 100, message = "Customer name must be between 2 and 100 characters")
    @Column(name = "customer_name", nullable = false, length = 100)
    private String customerName;

    @Size(max = 500, message = "Customer image URL cannot exceed 500 characters")
    @Column(name = "customer_image", length = 500)
    private String customerImage;

    @Size(max = 150, message = "Purchased phone cannot exceed 150 characters")
    @Column(name = "purchased_phone", length = 150)
    private String purchasedPhone;

    @NotNull(message = "Rating is required")
    @Min(value = 1, message = "Rating must be at least 1 star")
    @Max(value = 5, message = "Rating cannot exceed 5 stars")
    @Column(name = "rating", nullable = false)
    private Integer rating;

    @NotBlank(message = "Review text is required")
    @Size(min = 5, max = 2000, message = "Review text must be between 5 and 2000 characters")
    @Column(name = "review_text", nullable = false, columnDefinition = "TEXT")
    private String reviewText;

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
