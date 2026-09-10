package com.mobilestore.chat.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * ChatConversationResponse DTO
 * Module: chat
 * Outbound summary representation of a customer's conversation thread for the admin inbox.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatConversationResponse {

    private UUID customerId;
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private String customerAvatar;
    private String lastMessage;
    private String lastSenderRole;
    private LocalDateTime lastMessageTime;
    private long unreadCount;

    @com.fasterxml.jackson.annotation.JsonProperty("profileImage")
    public String getProfileImage() {
        return customerAvatar;
    }
}
