package com.mobilestore.contact.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * ReplyRequest DTO
 * Module: contact
 * Payload for store administrators to submit in-app responses to customer inquiries.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReplyRequest {

    @NotBlank(message = "Reply message cannot be blank")
    @Size(min = 2, max = 3000, message = "Reply must be between 2 and 3000 characters")
    private String replyMessage;

    @Builder.Default
    private String status = "REPLIED";
}
