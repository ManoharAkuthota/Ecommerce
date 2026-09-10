package com.mobilestore.compare.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

/**
 * CompareResponse DTO
 * Module: compare
 * Envelope response containing list of compared smartphones, live count, maximum limit, and feedback message.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompareResponse {

    @Builder.Default
    private List<CompareItemResponse> items = new ArrayList<>();

    private int count;

    @Builder.Default
    private int maxLimit = 4;

    private String message;
}
