package com.mobilestore.mobile.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/**
 * MobileRequest DTO
 * Module: mobile
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MobileRequest {

    @NotBlank(message = "Brand is required")
    @Size(max = 50, message = "Brand cannot exceed 50 characters")
    private String brand;

    @NotBlank(message = "Product name is required")
    @Size(max = 150, message = "Product name cannot exceed 150 characters")
    private String name;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.01", inclusive = true, message = "Price must be greater than zero")
    private BigDecimal price;

    @NotBlank(message = "RAM specification is required")
    @Size(max = 20, message = "RAM specification cannot exceed 20 characters")
    private String ram;

    @NotBlank(message = "Storage specification is required")
    @Size(max = 20, message = "Storage specification cannot exceed 20 characters")
    private String storage;

    @NotBlank(message = "Processor specification is required")
    @Size(max = 100, message = "Processor specification cannot exceed 100 characters")
    private String processor;

    @NotBlank(message = "Display specification is required")
    @Size(max = 150, message = "Display specification cannot exceed 150 characters")
    private String display;

    @NotBlank(message = "Battery specification is required")
    @Size(max = 100, message = "Battery specification cannot exceed 100 characters")
    private String battery;

    @jakarta.validation.constraints.Pattern(
        regexp = "^(?i)(IN_STOCK|LIMITED_STOCK|OUT_OF_STOCK|In Stock|Limited Stock|Out of Stock)$",
        message = "Stock status must be one of: 'IN_STOCK', 'LIMITED_STOCK', 'OUT_OF_STOCK'"
    )
    @Builder.Default
    private String stockStatus = "IN_STOCK";

    @Builder.Default
    private Boolean hidden = false;

    @Builder.Default
    private List<String> imageUrls = new ArrayList<>();
}
