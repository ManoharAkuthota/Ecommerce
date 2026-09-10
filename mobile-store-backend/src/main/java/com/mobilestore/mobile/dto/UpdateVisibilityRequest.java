package com.mobilestore.mobile.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * UpdateVisibilityRequest DTO
 * Module: mobile
 * Dedicated minimal payload for modifying smartphone visibility (hidden/visible).
 * - hidden: false -> Visible publicly across catalog and search.
 * - hidden: true  -> Hidden from public view, accessible only by admin.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateVisibilityRequest {

    @NotNull(message = "Hidden status is required")
    private Boolean hidden;
}
