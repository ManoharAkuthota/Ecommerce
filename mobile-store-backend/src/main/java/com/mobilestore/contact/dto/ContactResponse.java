package com.mobilestore.contact.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * ContactResponse DTO
 * Module: contact
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContactResponse {

    private UUID id;

    private String name;

    private String email;

    private String phone;

    private String message;

    private String status;

    private String adminReply;

    private LocalDateTime repliedAt;

    private LocalDateTime createdAt;
}
