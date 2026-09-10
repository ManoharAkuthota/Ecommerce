package com.mobilestore.chat.entity;

import com.mobilestore.user.entity.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * ChatMessage JPA Entity
 * Module: chat
 * Maps to 'chat_messages' table. Stores conversational messages exchanged
 * between a specific customer and the store owner/admin.
 */
@Entity
@Table(
        name = "chat_messages",
        indexes = {
                @Index(name = "idx_chat_user_created", columnList = "user_id, created_at"),
                @Index(name = "idx_chat_admin_read", columnList = "is_read_by_admin")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = "user")
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @JdbcTypeCode(SqlTypes.VARCHAR)
    @Column(name = "id", updatable = false, nullable = false, length = 36)
    @EqualsAndHashCode.Include
    private UUID id;

    @NotNull(message = "Customer user is required")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotBlank(message = "Sender role is required")
    @Column(name = "sender_role", nullable = false, length = 20)
    private String senderRole; // "CUSTOMER" or "ADMIN"

    @NotBlank(message = "Sender name is required")
    @Column(name = "sender_name", nullable = false, length = 100)
    private String senderName;

    @NotBlank(message = "Sender email is required")
    @Column(name = "sender_email", nullable = false, length = 150)
    private String senderEmail;

    @NotBlank(message = "Message content is required")
    @Size(min = 1, max = 3000, message = "Message must be between 1 and 3000 characters")
    @Column(name = "message", nullable = false, columnDefinition = "TEXT")
    private String message;

    @Column(name = "is_read_by_customer", nullable = false)
    @Builder.Default
    private boolean isReadByCustomer = false;

    @Column(name = "is_read_by_admin", nullable = false)
    @Builder.Default
    private boolean isReadByAdmin = false;

    @Column(name = "channel", length = 30)
    @Builder.Default
    private String channel = "SUPPORT"; // "SUPPORT" or "TRACKING"

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
