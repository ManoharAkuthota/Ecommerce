package com.mobilestore.contact.controller;

import com.mobilestore.contact.dto.ContactRequest;
import com.mobilestore.contact.dto.ContactResponse;
import com.mobilestore.contact.service.ContactService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * ContactController
 * Module: contact
 * REST Controller exposing customer concierge inquiry submission and
 * administrative inbox management endpoints.
 */
@Slf4j
@RestController
@RequestMapping("/api/contact")
public class ContactController {

    private final ContactService contactService;

    /**
     * Constructor injection for ContactService.
     */
    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    /**
     * POST /api/contact
     * Submit and persist a customer concierge inquiry message.
     *
     * @param request Validated contact form payload
     * @return HTTP 201 Created with saved ContactResponse DTO
     */
    @PostMapping
    public ResponseEntity<ContactResponse> submitMessage(@Valid @RequestBody ContactRequest request) {
        log.info("REST request to submit contact message from: {} ({})", request.getName(), request.getEmail());
        ContactResponse created = contactService.saveContactMessage(request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    /**
     * GET /api/contact
     * Retrieve all customer contact inquiries for the admin inbox.
     *
     * @return HTTP 200 with list of ContactResponse DTOs
     */
    @GetMapping
    public ResponseEntity<List<ContactResponse>> getAllMessages() {
        log.info("REST request to fetch all contact inquiries");
        List<ContactResponse> messages = contactService.getAllMessages();
        return ResponseEntity.ok(messages);
    }

    /**
     * GET /api/contact/{id}
     * Retrieve a specific contact inquiry by its UUID.
     *
     * @param id Message unique identifier
     * @return HTTP 200 with ContactResponse DTO
     */
    @GetMapping("/{id}")
    public ResponseEntity<ContactResponse> getMessageById(@PathVariable UUID id) {
        log.info("REST request to fetch contact inquiry with ID: {}", id);
        ContactResponse message = contactService.getMessageById(id);
        return ResponseEntity.ok(message);
    }

    /**
     * PUT /api/contact/{id}/reply
     * Submit an administrative in-app reply to a customer inquiry.
     *
     * @param id Message unique identifier
     * @param request Validated reply payload
     * @return HTTP 200 with updated ContactResponse DTO
     */
    @PutMapping("/{id}/reply")
    public ResponseEntity<ContactResponse> replyToMessage(
            @PathVariable UUID id,
            @Valid @RequestBody com.mobilestore.contact.dto.ReplyRequest request) {
        log.info("REST request to submit in-app reply for inquiry ID: {}", id);
        ContactResponse updated = contactService.replyToMessage(id, request);
        return ResponseEntity.ok(updated);
    }

    /**
     * PATCH /api/contact/{id}/status
     * Update inquiry processing status (PENDING, REPLIED, RESOLVED).
     *
     * @param id Message unique identifier
     * @param status New status value
     * @return HTTP 200 with updated ContactResponse DTO
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<ContactResponse> updateStatus(
            @PathVariable UUID id,
            @RequestParam String status) {
        log.info("REST request to update status of inquiry ID {} to {}", id, status);
        ContactResponse updated = contactService.updateMessageStatus(id, status);
        return ResponseEntity.ok(updated);
    }

    /**
     * DELETE /api/contact/{id}
     * Delete an inquiry message from the admin inbox.
     *
     * @param id Message unique identifier
     * @return HTTP 204 No Content
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMessage(@PathVariable UUID id) {
        log.info("REST request to delete contact inquiry with ID: {}", id);
        contactService.deleteMessage(id);
        return ResponseEntity.noContent().build();
    }
}
