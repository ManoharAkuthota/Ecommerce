package com.mobilestore.contact.service;

import com.mobilestore.contact.dto.ContactRequest;
import com.mobilestore.contact.dto.ContactResponse;
import com.mobilestore.contact.dto.ReplyRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

/**
 * ContactService
 * Module: contact
 * Service contract for customer concierge inquiries and administrative inbox management.
 */
public interface ContactService {

    /**
     * Submit and save a customer contact/inquiry message.
     *
     * @param request Validated contact form payload
     * @return ContactResponse representation of the saved message
     */
    ContactResponse saveContactMessage(ContactRequest request);

    /**
     * Retrieve all contact inquiries ordered by latest first.
     *
     * @return List of ContactResponse objects
     */
    List<ContactResponse> getAllMessages();

    /**
     * Retrieve a paginated list of contact messages for the admin inbox.
     *
     * @param pageable Pagination and sorting criteria
     * @return Page of ContactResponse objects
     */
    Page<ContactResponse> getMessages(Pageable pageable);

    /**
     * Retrieve all messages submitted by a specific email address.
     *
     * @param email Customer email address
     * @return List of ContactResponse inquiries
     */
    List<ContactResponse> findByEmail(String email);

    /**
     * Retrieve a single contact message by its unique identifier.
     *
     * @param id Message unique identifier
     * @return ContactResponse message details
     */
    ContactResponse getMessageById(UUID id);

    /**
     * Store administrator in-app reply to a customer inquiry.
     *
     * @param id Inquiry UUID
     * @param replyRequest Reply message payload
     * @return Updated ContactResponse with reply and updated status
     */
    ContactResponse replyToMessage(UUID id, ReplyRequest replyRequest);

    /**
     * Update inquiry message status (e.g. PENDING, REPLIED, RESOLVED).
     *
     * @param id Inquiry UUID
     * @param status New status string
     * @return Updated ContactResponse
     */
    ContactResponse updateMessageStatus(UUID id, String status);

    /**
     * Delete an inquiry message from the admin inbox.
     *
     * @param id Message unique identifier
     */
    void deleteMessage(UUID id);
}
