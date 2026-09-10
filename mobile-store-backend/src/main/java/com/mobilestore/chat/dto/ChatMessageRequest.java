package com.mobilestore.chat.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

/**
 * ChatMessageRequest DTO
 * Module: chat
 * Inbound payload for sending a chat message or admin reply.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessageRequest {

    @NotBlank(message = "Message content is required")
    @Size(min = 1, max = 3000, message = "Message must be between 1 and 3000 characters")
    private String message;

    private String channel; // "SUPPORT" or "TRACKING"
}
