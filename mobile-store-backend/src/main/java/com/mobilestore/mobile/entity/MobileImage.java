package com.mobilestore.mobile.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
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
 * MobileImage JPA Entity
 * Module: mobile
 * Maps to 'mobile_images' table. Stores Cloudinary image URLs for smartphones (1 to 5 images per phone).
 */
@Entity
@Table(name = "mobile_images")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = "mobile")
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class MobileImage {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @JdbcTypeCode(SqlTypes.VARCHAR)
    @Column(name = "id", updatable = false, nullable = false, length = 36)
    @EqualsAndHashCode.Include
    private UUID id;

    @NotNull(message = "Associated mobile reference is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mobile_id", nullable = false)
    @JsonBackReference
    private Mobile mobile;

    @NotBlank(message = "Image URL is required")
    @Size(max = 500, message = "Image URL cannot exceed 500 characters")
    @Column(name = "image_url", nullable = false, length = 500)
    private String imageUrl;

    @Builder.Default
    @NotNull(message = "Image order is required")
    @Min(value = 1, message = "Image order must be at least 1")
    @Max(value = 5, message = "Maximum of 5 images allowed per mobile")
    @Column(name = "image_order", nullable = false)
    private Integer imageOrder = 1;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (this.imageOrder == null) {
            this.imageOrder = 1;
        }
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }
}
