package com.mobilestore.contact.service.impl;

import com.mobilestore.contact.dto.ContactRequest;
import com.mobilestore.contact.dto.ContactResponse;
import com.mobilestore.contact.entity.ContactMessage;
import com.mobilestore.contact.repository.ContactMessageRepository;
import com.mobilestore.contact.service.ContactService;
import com.mobilestore.exception.ResourceNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

/**
 * ContactServiceImpl
 * Module: contact
 * Enterprise implementation of the ContactService interface.
 * Handles customer concierge inquiries, email auditing, and admin inbox workflows.
 */
@Slf4j
@Service
@Transactional(readOnly = true)
public class ContactServiceImpl implements ContactService {

    private final ContactMessageRepository contactMessageRepository;

    /**
     * Constructor injection for required repository.
     */
    public ContactServiceImpl(ContactMessageRepository contactMessageRepository) {
        this.contactMessageRepository = contactMessageRepository;
    }

    @Override
    @Transactional
    public ContactResponse saveContactMessage(ContactRequest request) {
        log.info("Receiving contact inquiry from: {} ({})", request.getName(), request.getEmail());

        ContactMessage message = mapToEntity(request);
        ContactMessage saved = contactMessageRepository.save(message);
        log.info("Contact message saved successfully with ID: {}", saved.getId());

        return mapToResponse(saved);
    }

    @Override
    public List<ContactResponse> getAllMessages() {
        log.debug("Fetching all contact inquiries ordered by latest first");
        return contactMessageRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public Page<ContactResponse> getMessages(Pageable pageable) {
        log.debug("Fetching paginated contact inbox: page={}, size={}", pageable.getPageNumber(), pageable.getPageSize());
        return contactMessageRepository.findAllByOrderByCreatedAtDesc(pageable)
                .map(this::mapToResponse);
    }

    @Override
    public List<ContactResponse> findByEmail(String email) {
        log.debug("Searching messages submitted by email: {}", email);
        return contactMessageRepository.findByEmailIgnoreCaseOrderByCreatedAtDesc(email.trim()).stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public ContactResponse getMessageById(UUID id) {
        log.debug("Fetching contact inquiry with ID: {}", id);
        ContactMessage message = contactMessageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ContactMessage", "id", id));
        return mapToResponse(message);
    }

    @Override
    @Transactional
    public ContactResponse replyToMessage(UUID id, com.mobilestore.contact.dto.ReplyRequest replyRequest) {
        log.info("Submitting in-app admin reply to message ID: {}", id);
        ContactMessage message = contactMessageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ContactMessage", "id", id));

        message.setAdminReply(replyRequest.getReplyMessage().trim());
        message.setStatus(replyRequest.getStatus() != null && !replyRequest.getStatus().isBlank()
                ? replyRequest.getStatus().trim()
                : "REPLIED");
        message.setRepliedAt(java.time.LocalDateTime.now());

        ContactMessage updated = contactMessageRepository.save(message);
        log.info("In-app reply saved successfully for message ID: {}", id);
        return mapToResponse(updated);
    }

    @Override
    @Transactional
    public ContactResponse updateMessageStatus(UUID id, String status) {
        log.info("Updating status of message ID {} to {}", id, status);
        ContactMessage message = contactMessageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ContactMessage", "id", id));

        message.setStatus(status != null && !status.isBlank() ? status.trim() : "PENDING");
        ContactMessage updated = contactMessageRepository.save(message);
        return mapToResponse(updated);
    }

    @Override
    @Transactional
    public void deleteMessage(UUID id) {
        log.info("Deleting contact message with ID: {}", id);

        ContactMessage message = contactMessageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ContactMessage", "id", id));

        contactMessageRepository.delete(message);
        log.info("Contact message deleted successfully with ID: {}", id);
    }

    // =========================================================================
    // Reusable Private Mapping Helpers
    // =========================================================================

    private ContactMessage mapToEntity(ContactRequest request) {
        return ContactMessage.builder()
                .name(request.getName().trim())
                .email(request.getEmail().trim())
                .phone(request.getPhone() != null ? request.getPhone().trim() : null)
                .message(request.getMessage().trim())
                .status("PENDING")
                .build();
    }

    private ContactResponse mapToResponse(ContactMessage message) {
        return ContactResponse.builder()
                .id(message.getId())
                .name(message.getName())
                .email(message.getEmail())
                .phone(message.getPhone())
                .message(message.getMessage())
                .status(message.getStatus() != null ? message.getStatus() : "PENDING")
                .adminReply(message.getAdminReply())
                .repliedAt(message.getRepliedAt())
                .createdAt(message.getCreatedAt())
                .build();
    }
}
