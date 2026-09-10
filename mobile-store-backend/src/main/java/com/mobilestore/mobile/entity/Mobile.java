package com.mobilestore.mobile.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.mobilestore.mobile.entity.enums.StockStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Mobile JPA Entity
 * Module: mobile
 * Maps to 'mobiles' table. Stores smartphone catalog specifications, pricing, stock status,
 * and maintains a bidirectional one-to-many relationship with MobileImage entities.
 */
@Entity
@Table(name = "mobiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = "images")
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Mobile {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @JdbcTypeCode(SqlTypes.VARCHAR)
    @Column(name = "id", updatable = false, nullable = false, length = 36)
    @EqualsAndHashCode.Include
    private UUID id;

    @NotBlank(message = "Brand is required")
    @Size(max = 50, message = "Brand cannot exceed 50 characters")
    @Column(name = "brand", nullable = false, length = 50)
    private String brand;

    @NotBlank(message = "Smartphone name is required")
    @Size(max = 150, message = "Smartphone name cannot exceed 150 characters")
    @Column(name = "name", nullable = false, length = 150)
    private String name;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.00", inclusive = true, message = "Price must be greater than or equal to 0.00")
    @Column(name = "price", nullable = false, precision = 12, scale = 2)
    private BigDecimal price;

    @NotBlank(message = "RAM specification is required")
    @Size(max = 20, message = "RAM specification cannot exceed 20 characters")
    @Column(name = "ram", nullable = false, length = 20)
    private String ram;

    @NotBlank(message = "Storage specification is required")
    @Size(max = 20, message = "Storage specification cannot exceed 20 characters")
    @Column(name = "storage", nullable = false, length = 20)
    private String storage;

    @NotBlank(message = "Processor specification is required")
    @Size(max = 100, message = "Processor specification cannot exceed 100 characters")
    @Column(name = "processor", nullable = false, length = 100)
    private String processor;

    @NotBlank(message = "Display specification is required")
    @Size(max = 150, message = "Display specification cannot exceed 150 characters")
    @Column(name = "display", nullable = false, length = 150)
    private String display;

    @NotBlank(message = "Battery specification is required")
    @Size(max = 100, message = "Battery specification cannot exceed 100 characters")
    @Column(name = "battery", nullable = false, length = 100)
    private String battery;

    @NotNull(message = "Stock status is required")
    @Convert(converter = com.mobilestore.mobile.entity.enums.StockStatusConverter.class)
    @Column(name = "stock_status", nullable = false, length = 30)
    @Builder.Default
    private StockStatus stockStatus = StockStatus.IN_STOCK;

    @Builder.Default
    @NotNull(message = "Hidden flag is required")
    @Column(name = "hidden", nullable = false)
    private Boolean hidden = false;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Builder.Default
    @OneToMany(mappedBy = "mobile", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("imageOrder ASC")
    @JsonManagedReference
    private List<MobileImage> images = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        if (this.stockStatus == null) {
            this.stockStatus = StockStatus.IN_STOCK;
        }
        if (this.hidden == null) {
            this.hidden = false;
        }
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.updatedAt == null) {
            this.updatedAt = LocalDateTime.now();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public void addImage(MobileImage image) {
        if (image != null) {
            images.add(image);
            image.setMobile(this);
        }
    }

    public void removeImage(MobileImage image) {
        if (image != null) {
            images.remove(image);
            image.setMobile(null);
        }
    }
}
