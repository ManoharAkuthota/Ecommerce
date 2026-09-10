package com.mobilestore.mobile.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

/**
 * MobileImageResponse DTO
 * Module: mobile
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MobileImageResponse {

    private UUID id;

    private String imageUrl;

    private Integer imageOrder;
}
