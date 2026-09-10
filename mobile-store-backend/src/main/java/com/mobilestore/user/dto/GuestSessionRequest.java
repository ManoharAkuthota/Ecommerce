package com.mobilestore.user.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * GuestSessionRequest
 * Module: user
 * Input payload for initializing an instant storefront visitor live chat session.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GuestSessionRequest {

    private String fullName;
    private String email;
    private String phoneNumber;
}