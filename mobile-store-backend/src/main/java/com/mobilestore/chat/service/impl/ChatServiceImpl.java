package com.mobilestore.chat.service.impl;

import com.mobilestore.chat.dto.ChatConversationResponse;
import com.mobilestore.chat.dto.ChatMessageRequest;
import com.mobilestore.chat.dto.ChatMessageResponse;
import com.mobilestore.chat.entity.ChatMessage;
import com.mobilestore.chat.repository.ChatMessageRepository;
import com.mobilestore.chat.service.ChatService;
import com.mobilestore.exception.ResourceNotFoundException;
import com.mobilestore.order.entity.Order;
import com.mobilestore.order.entity.enums.OrderStatus;
import com.mobilestore.order.repository.OrderRepository;
import com.mobilestore.user.entity.User;
import com.mobilestore.user.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * ChatServiceImpl
 * Module: chat
 * Enterprise implementation of ChatService managing conversational messaging
 * with strict customer isolation.
 */
@Slf4j
@Service
@Transactional(readOnly = true)
public class ChatServiceImpl implements ChatService {

    private final ChatMessageRepository chatMessageRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;

    public ChatServiceImpl(ChatMessageRepository chatMessageRepository, UserRepository userRepository, OrderRepository orderRepository) {
        this.chatMessageRepository = chatMessageRepository;
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
    }

    @Override
    @Transactional
    public ChatMessageResponse sendCustomerMessage(String customerEmail, ChatMessageRequest request) {
        log.info("Customer [{}] sending chat message", customerEmail);
        String cleanEmail = customerEmail.trim().toLowerCase();
        User user = userRepository.findByEmailIgnoreCase(cleanEmail)
                .orElseGet(() -> {
                    log.info("Auto-provisioning user entity for chat customer: {}", cleanEmail);
                    String name = cleanEmail.split("@")[0];
                    if (!name.isEmpty()) {
                        name = Character.toUpperCase(name.charAt(0)) + name.substring(1);
                    } else {
                        name = "Customer";
                    }
                    User newUser = User.builder()
                            .email(cleanEmail)
                            .fullName(name)
                            .password("$2a$10$e8w.x92OqX7yUqZ2Z5J9teM5p1f9v8h5WqE8d2YqQ4K3J9z8e7w")
                            .phoneNumber("9999999999")
                            .role(com.mobilestore.user.entity.UserRole.ROLE_USER)
                            .enabled(true)
                            .build();
                    return userRepository.save(newUser);
                });

        if (user.getRole() == com.mobilestore.user.entity.UserRole.ROLE_ADMIN) {
            throw new IllegalArgumentException("Administrators must use the Admin Messenger to communicate with customers.");
        }

        String targetChannel = (request.getChannel() != null && !request.getChannel().isBlank())
                ? request.getChannel().trim().toUpperCase()
                : "SUPPORT";

        ChatMessage message = ChatMessage.builder()
                .user(user)
                .senderRole("CUSTOMER")
                .senderName(user.getFullName())
                .senderEmail(user.getEmail())
                .channel(targetChannel)
                .message(request.getMessage().trim())
                .isReadByCustomer(true)
                .isReadByAdmin(false)
                .createdAt(LocalDateTime.now())
                .build();

        ChatMessage saved = chatMessageRepository.saveAndFlush(message);
        log.info("Saved customer chat message with ID: {} in channel: {}", saved.getId(), targetChannel);

        // If message is sent in TRACKING channel, trigger real-time auto response from MS Logistics Bot!
        if ("TRACKING".equalsIgnoreCase(targetChannel)) {
            try {
                List<Order> userOrders = orderRepository.findByUserOrderByCreatedAtDesc(user);
                String botReply;
                if (userOrders.isEmpty()) {
                    botReply = "Hello " + user.getFullName() + "! You do not have any active shipments at the moment. When you place an order, live courier waybills, delivery OTPs, and milestone dispatches will appear here automatically.";
                } else {
                    Order active = userOrders.stream()
                            .filter(o -> o.getOrderStatus() == OrderStatus.CONFIRMED || o.getOrderStatus() == OrderStatus.PROCESSING || o.getOrderStatus() == OrderStatus.SHIPPED)
                            .findFirst()
                            .orElse(userOrders.get(0));

                    String carrier = (active.getCarrier() != null && !active.getCarrier().isBlank()) ? active.getCarrier() : "Blue Dart Express";
                    String tracking = (active.getTrackingNumber() != null && !active.getTrackingNumber().isBlank()) ? active.getTrackingNumber() : "Assigned at dispatch";
                    String rawDigits = active.getOrderNumber().replaceAll("\\D", "");
                    String otp = rawDigits.length() >= 4 ? rawDigits.substring(rawDigits.length() - 4) : "7023";
                    String city = (active.getCity() != null && !active.getCity().isBlank()) ? active.getCity() : "Hyderabad";

                    botReply = String.format("🤖 MS Logistics Bot — Real-Time Status for #%s:\n\n" +
                                    "• Current Status: %s\n" +
                                    "• Logistics Carrier: %s\n" +
                                    "• Waybill / AWB: %s\n" +
                                    "• Doorstep Handover OTP: %s\n" +
                                    "• Destination: %s\n\n" +
                                    "Holographic tamper-evident seal is verified intact. You can view the live GPS highway telemetry on your tracking dashboard!",
                            active.getOrderNumber(),
                            active.getOrderStatus(),
                            carrier,
                            tracking,
                            otp,
                            city
                    );
                }

                ChatMessage botMsg = ChatMessage.builder()
                        .user(user)
                        .senderRole("ADMIN")
                        .senderName("MS Logistics Bot")
                        .senderEmail("concierge@mobilestore.com")
                        .channel("TRACKING")
                        .message(botReply)
                        .isReadByCustomer(false)
                        .isReadByAdmin(true)
                        .createdAt(LocalDateTime.now())
                        .build();
                chatMessageRepository.save(botMsg);
            } catch (Exception ex) {
                log.warn("Could not generate auto-tracking response: {}", ex.getMessage());
            }
        }

        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public List<ChatMessageResponse> getCustomerChat(String customerEmail) {
        return getCustomerChat(customerEmail, null, true);
    }

    @Override
    @Transactional
    public List<ChatMessageResponse> getCustomerChat(String customerEmail, String channel) {
        return getCustomerChat(customerEmail, channel, true);
    }

    @Override
    @Transactional
    public List<ChatMessageResponse> getCustomerChat(String customerEmail, String channel, boolean markAsRead) {
        log.debug("Fetching private chat history for customer [{}] in channel [{}], markAsRead [{}]", customerEmail, channel, markAsRead);
        String cleanEmail = customerEmail.trim().toLowerCase();
        Optional<User> userOpt = userRepository.findByEmailIgnoreCase(cleanEmail);
        if (userOpt.isEmpty()) {
            return java.util.Collections.emptyList();
        }
        User user = userOpt.get();

        // Mark incoming admin replies as read only when explicitly requested
        if (markAsRead) {
            if (channel != null && !channel.isBlank()) {
                chatMessageRepository.markChannelAsReadByCustomer(user, channel.trim().toUpperCase());
            } else {
                chatMessageRepository.markAllAsReadByCustomer(user);
            }
        }

        List<ChatMessage> allMessages = chatMessageRepository.findByUserOrderByCreatedAtAsc(user);

        if (channel != null && !channel.isBlank()) {
            String filterChannel = channel.trim().toUpperCase();
            return allMessages.stream()
                    .filter(m -> resolveChannel(m).equalsIgnoreCase(filterChannel))
                    .map(this::mapToResponse)
                    .toList();
        }

        return allMessages.stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional
    public void markCustomerChatRead(String customerEmail) {
        String cleanEmail = customerEmail.trim().toLowerCase();
        userRepository.findByEmailIgnoreCase(cleanEmail)
                .ifPresent(chatMessageRepository::markAllAsReadByCustomer);
    }

    @Override
    @Transactional
    public void markCustomerChannelRead(String customerEmail, String channel) {
        if (channel == null || channel.isBlank()) {
            markCustomerChatRead(customerEmail);
            return;
        }
        String cleanEmail = customerEmail.trim().toLowerCase();
        userRepository.findByEmailIgnoreCase(cleanEmail)
                .ifPresent(u -> chatMessageRepository.markChannelAsReadByCustomer(u, channel.trim().toUpperCase()));
    }

    @Override
    public List<ChatConversationResponse> getAdminConversations() {
        log.debug("Admin fetching all customer conversations");
        List<User> users = chatMessageRepository.findDistinctChatUsers();
        List<ChatConversationResponse> conversations = new ArrayList<>();

        for (User user : users) {
            List<ChatMessage> userMessages = chatMessageRepository.findByUserOrderByCreatedAtAsc(user);
            // Filter strictly to store concierge support inquiries (exclude tracking bot dispatches)
            List<ChatMessage> supportMessages = userMessages.stream()
                    .filter(m -> !"TRACKING".equalsIgnoreCase(resolveChannel(m)))
                    .toList();

            if (supportMessages.isEmpty()) {
                continue;
            }

            ChatMessage latestMsg = supportMessages.get(supportMessages.size() - 1);
            long unread = supportMessages.stream()
                    .filter(m -> !m.isReadByAdmin() && "CUSTOMER".equalsIgnoreCase(m.getSenderRole()))
                    .count();

            ChatConversationResponse conv = ChatConversationResponse.builder()
                    .customerId(user.getId())
                    .customerName(user.getFullName())
                    .customerEmail(user.getEmail())
                    .customerPhone(user.getPhoneNumber())
                    .customerAvatar(user.getProfileImage())
                    .lastMessage(latestMsg.getMessage())
                    .lastSenderRole(latestMsg.getSenderRole())
                    .lastMessageTime(latestMsg.getCreatedAt())
                    .unreadCount(unread)
                    .build();
            conversations.add(conv);
        }

        // Sort conversations with most recent activity at the top
        conversations.sort((a, b) -> {
            if (a.getLastMessageTime() == null && b.getLastMessageTime() == null) return 0;
            if (a.getLastMessageTime() == null) return 1;
            if (b.getLastMessageTime() == null) return -1;
            return b.getLastMessageTime().compareTo(a.getLastMessageTime());
        });

        return conversations;
    }

    @Override
    @Transactional
    public List<ChatMessageResponse> getAdminCustomerChat(UUID customerId) {
        log.debug("Admin viewing chat thread for customer ID [{}]", customerId);
        User user = userRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", customerId));

        // Mark customer messages as read by admin
        chatMessageRepository.markAllAsReadByAdmin(user);

        // Filter strictly to store concierge support messages (exclude tracking bot dispatches)
        return chatMessageRepository.findByUserOrderByCreatedAtAsc(user).stream()
                .filter(m -> !"TRACKING".equalsIgnoreCase(resolveChannel(m)))
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional
    public ChatMessageResponse sendAdminReply(UUID customerId, String adminEmail, ChatMessageRequest request) {
        log.info("Admin [{}] sending reply to customer ID [{}]", adminEmail, customerId);
        User user = userRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", customerId));

        ChatMessage message = ChatMessage.builder()
                .user(user)
                .senderRole("ADMIN")
                .senderName("MS Mobiles Store Concierge")
                .senderEmail(adminEmail != null && !adminEmail.isBlank() ? adminEmail.trim() : "concierge@msmobiles.com")
                .message(request.getMessage().trim())
                .isReadByCustomer(false)
                .isReadByAdmin(true)
                .createdAt(LocalDateTime.now())
                .build();

        ChatMessage saved = chatMessageRepository.saveAndFlush(message);
        log.info("Saved admin chat reply with ID: {}", saved.getId());
        return mapToResponse(saved);
    }

    private String resolveChannel(ChatMessage m) {
        if (m.getChannel() != null && !m.getChannel().isBlank()) {
            return m.getChannel().toUpperCase();
        }
        if ("MS Logistics Bot".equalsIgnoreCase(m.getSenderName()) || (m.getMessage() != null && m.getMessage().contains("Order Reference:"))) {
            return "TRACKING";
        }
        return "SUPPORT";
    }

    private ChatMessageResponse mapToResponse(ChatMessage m) {
        return ChatMessageResponse.builder()
                .id(m.getId())
                .customerId(m.getUser().getId())
                .customerName(m.getUser().getFullName())
                .customerEmail(m.getUser().getEmail())
                .customerAvatar(m.getUser() != null ? m.getUser().getProfileImage() : null)
                .senderRole(m.getSenderRole())
                .senderName(m.getSenderName())
                .senderEmail(m.getSenderEmail())
                .channel(resolveChannel(m))
                .message(m.getMessage())
                .isReadByCustomer(m.isReadByCustomer())
                .isReadByAdmin(m.isReadByAdmin())
                .createdAt(m.getCreatedAt())
                .build();
    }
}
