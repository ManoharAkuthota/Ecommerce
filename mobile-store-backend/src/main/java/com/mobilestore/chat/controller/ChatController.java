package com.mobilestore.chat.controller;

import com.mobilestore.chat.dto.ChatMessageRequest;
import com.mobilestore.chat.dto.ChatMessageResponse;
import com.mobilestore.chat.service.ChatService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * ChatController
 * Module: chat
 * Customer-facing REST controller for conversational chat with MS Mobiles store concierge.
 * All endpoints require valid customer Bearer JWT authentication.
 */
@Slf4j
@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    /**
     * GET /api/chat/messages
     * Fetch the authenticated customer's private conversation thread.
     */
    @GetMapping("/messages")
    public ResponseEntity<List<ChatMessageResponse>> getMyChat(
            @RequestParam(required = false) String channel,
            @RequestParam(required = false, defaultValue = "false") boolean markRead,
            Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String customerEmail = authentication.getName();
        log.info("REST request from customer [{}] to retrieve chat messages in channel [{}], markRead [{}]", customerEmail, channel, markRead);
        List<ChatMessageResponse> messages = chatService.getCustomerChat(customerEmail, channel, markRead);
        return ResponseEntity.ok(messages);
    }

    /**
     * POST /api/chat/messages
     * Send a new message to the MS Mobiles store team.
     */
    @PostMapping("/messages")
    public ResponseEntity<ChatMessageResponse> sendMessage(
            @Valid @RequestBody ChatMessageRequest request,
            Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String customerEmail = authentication.getName();
        log.info("REST request from customer [{}] to send chat message", customerEmail);
        ChatMessageResponse created = chatService.sendCustomerMessage(customerEmail, request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    /**
     * POST /api/chat/read
     * Mark incoming store responses as read by the customer.
     */
    @PostMapping("/read")
    public ResponseEntity<Void> markRead(
            @RequestParam(required = false) String channel,
            Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String customerEmail = authentication.getName();
        if (channel != null && !channel.isBlank()) {
            chatService.markCustomerChannelRead(customerEmail, channel);
        } else {
            chatService.markCustomerChatRead(customerEmail);
        }
        return ResponseEntity.ok().build();
    }
}
