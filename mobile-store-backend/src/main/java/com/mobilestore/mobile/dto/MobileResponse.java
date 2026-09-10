package com.mobilestore.mobile.dto;

import com.mobilestore.mobile.entity.enums.StockStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * MobileResponse DTO
 * Module: mobile
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MobileResponse {

    private UUID id;

    private String brand;

    private String name;

    private BigDecimal price;

    private String ram;

    private String storage;

    private String processor;

    private String display;

    private String battery;

    private StockStatus stockStatus;

    private Boolean hidden;

    @Builder.Default
    private List<MobileImageResponse> images = new ArrayList<>();

    @Builder.Default
    private List<String> imageUrls = new ArrayList<>();

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
