package com.mobilestore.mobile.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * VisibilityUpdateRequest DTO
 * Module: mobile
 * Dedicated payload for updating the visibility (hidden/visible) of a smartphone.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VisibilityUpdateRequest {

    @NotNull(message = "Visibility flag (hidden) is required")
    private Boolean hidden;
}
