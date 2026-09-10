package com.mobilestore.stockalert.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * StockAlertResponse DTO
 * Module: stockalert
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StockAlertResponse {

    private UUID id;
    private UUID mobileId;
    private String mobileName;
    private String mobileBrand;
    private String mobileImage;
    private String email;
    private String phoneNumber;
    private boolean notified;
    private LocalDateTime createdAt;
    private LocalDateTime notifiedAt;
}
