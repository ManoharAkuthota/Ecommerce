package com.mobilestore.chat.service;

import com.mobilestore.chat.dto.ChatConversationResponse;
import com.mobilestore.chat.dto.ChatMessageRequest;
import com.mobilestore.chat.dto.ChatMessageResponse;

import java.util.List;
import java.util.UUID;

/**
 * ChatService Interface
 * Module: chat
 * Business logic contract for customer-admin live chat messaging.
 */
public interface ChatService {

    /**
     * Customer sends a message to the store manager.
     */
    ChatMessageResponse sendCustomerMessage(String customerEmail, ChatMessageRequest request);

    /**
     * Customer retrieves their full private chat history with the store.
     * Automatically marks any incoming admin messages as read by the customer.
     */
    List<ChatMessageResponse> getCustomerChat(String customerEmail);

    /**
     * Customer retrieves their private chat history filtered by channel (SUPPORT or TRACKING).
     */
    List<ChatMessageResponse> getCustomerChat(String customerEmail, String channel);

    /**
     * Customer retrieves their private chat history filtered by channel with explicit mark-as-read control.
     */
    List<ChatMessageResponse> getCustomerChat(String customerEmail, String channel, boolean markAsRead);

    /**
     * Customer marks all unread store replies as read.
     */
    void markCustomerChatRead(String customerEmail);

    /**
     * Customer marks all unread messages in a specific channel as read.
     */
    void markCustomerChannelRead(String customerEmail, String channel);

    /**
     * Admin retrieves all active customer conversations with last message snippets and unread counters.
     */
    List<ChatConversationResponse> getAdminConversations();

    /**
     * Admin retrieves the full conversation history for a specific customer.
     * Automatically marks customer messages as read by admin.
     */
    List<ChatMessageResponse> getAdminCustomerChat(UUID customerId);

    /**
     * Admin posts a reply message into a specific customer's conversation thread.
     */
    ChatMessageResponse sendAdminReply(UUID customerId, String adminEmail, ChatMessageRequest request);
}
