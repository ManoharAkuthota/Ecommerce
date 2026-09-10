package com.mobilestore.compare.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * CompareItemResponse DTO
 * Module: compare
 * Specification data transfer object for a single compared smartphone.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompareItemResponse {

    private UUID mobileId;
    private String brand;
    private String name;
    private BigDecimal price;
    private String formattedPrice;
    private List<String> images;
    private String firstImage;
    private String ram;
    private String storage;
    private String processor;
    private String display;
    private String battery;
    private String stock;
    private String stockStatus;
    private LocalDateTime addedDate;
}
