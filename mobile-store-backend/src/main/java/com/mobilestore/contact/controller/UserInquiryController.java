package com.mobilestore.contact.controller;

import com.mobilestore.contact.dto.ContactResponse;
import com.mobilestore.contact.service.ContactService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * UserInquiryController
 * Module: contact
 * Customer portal endpoint allowing customers to view their submitted inquiries
 * and in-app replies from the store owner without requiring external email.
 */
@Slf4j
@RestController
@RequestMapping("/api/user/inquiries")
public class UserInquiryController {

    private final ContactService contactService;

    public UserInquiryController(ContactService contactService) {
        this.contactService = contactService;
    }

    /**
     * GET /api/user/inquiries
     * Retrieve all concierge inquiries and in-app responses for the authenticated customer.
     *
     * @param authentication Spring Security authentication principal
     * @return List of ContactResponse objects belonging to this customer
     */
    @GetMapping
    public ResponseEntity<List<ContactResponse>> getMyInquiries(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            return ResponseEntity.status(401).build();
        }

        String customerEmail = authentication.getName();
        log.info("Customer fetching their submitted inquiries: {}", customerEmail);
        List<ContactResponse> inquiries = contactService.findByEmail(customerEmail);
        return ResponseEntity.ok(inquiries);
    }
}
