package com.mobilestore.chat.controller;

import com.mobilestore.chat.dto.ChatConversationResponse;
import com.mobilestore.chat.dto.ChatMessageRequest;
import com.mobilestore.chat.dto.ChatMessageResponse;
import com.mobilestore.chat.service.ChatService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * AdminChatController
 * Module: chat
 * Administrative REST controller for managing live customer conversations.
 * All endpoints require ROLE_ADMIN authorization.
 */
@Slf4j
@RestController
@RequestMapping("/api/admin/chat")
@PreAuthorize("hasRole('ADMIN')")
public class AdminChatController {

    private final ChatService chatService;

    public AdminChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    /**
     * GET /api/admin/chat/conversations
     * Fetch all active customer chat threads with unread counts and latest messages.
     */
    @GetMapping("/conversations")
    public ResponseEntity<List<ChatConversationResponse>> getConversations() {
        log.info("REST request by administrator to fetch customer chat conversations");
        List<ChatConversationResponse> conversations = chatService.getAdminConversations();
        return ResponseEntity.ok(conversations);
    }

    /**
     * GET /api/admin/chat/conversations/{customerId}
     * Fetch full chronological conversation history with a specific customer.
     */
    @GetMapping("/conversations/{customerId}")
    public ResponseEntity<List<ChatMessageResponse>> getCustomerChat(@PathVariable UUID customerId) {
        log.info("REST request by administrator to view chat thread for customer [{}]", customerId);
        List<ChatMessageResponse> messages = chatService.getAdminCustomerChat(customerId);
        return ResponseEntity.ok(messages);
    }

    /**
     * POST /api/admin/chat/conversations/{customerId}/reply
     * Send an administrator reply directly back into the customer's chat screen.
     */
    @PostMapping("/conversations/{customerId}/reply")
    public ResponseEntity<ChatMessageResponse> replyToCustomer(
            @PathVariable UUID customerId,
            @Valid @RequestBody ChatMessageRequest request,
            Authentication authentication) {
        String adminEmail = authentication != null ? authentication.getName() : "admin@antigravity.com";
        log.info("REST request by administrator [{}] to reply to customer [{}]", adminEmail, customerId);
        ChatMessageResponse reply = chatService.sendAdminReply(customerId, adminEmail, request);
        return ResponseEntity.ok(reply);
    }
}
