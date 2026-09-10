package com.mobilestore.chat.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * ChatMessageResponse DTO
 * Module: chat
 * Outbound representation of an individual message bubble in a chat conversation.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessageResponse {

    private UUID id;
    private UUID customerId;
    private String customerName;
    private String customerEmail;
    private String customerAvatar;
    private String senderRole; // "CUSTOMER" or "ADMIN"
    private String senderName;
    private String senderEmail;
    private String message;
    private String channel; // "SUPPORT" or "TRACKING"

    @com.fasterxml.jackson.annotation.JsonProperty("profileImage")
    public String getProfileImage() {
        return customerAvatar;
    }

    @com.fasterxml.jackson.annotation.JsonProperty("isReadByCustomer")
    private boolean isReadByCustomer;

    @com.fasterxml.jackson.annotation.JsonProperty("isReadByAdmin")
    private boolean isReadByAdmin;

    @com.fasterxml.jackson.annotation.JsonProperty("readByCustomer")
    public boolean getReadByCustomer() {
        return isReadByCustomer;
    }

    @com.fasterxml.jackson.annotation.JsonProperty("readByAdmin")
    public boolean getReadByAdmin() {
        return isReadByAdmin;
    }

    private LocalDateTime createdAt;
}
