package com.mobilestore.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * AdminResponse DTO
 * Module: admin
 * Represents the public administrative profile without exposing credentials.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminResponse {

    private UUID id;

    private String name;

    private String email;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
