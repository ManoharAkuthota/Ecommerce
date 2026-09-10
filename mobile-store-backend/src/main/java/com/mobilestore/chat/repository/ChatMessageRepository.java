package com.mobilestore.chat.repository;

import com.mobilestore.chat.entity.ChatMessage;
import com.mobilestore.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * ChatMessageRepository
 * Module: chat
 * Spring Data JPA repository for customer-admin chat messaging threads.
 */
@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, UUID> {

    List<ChatMessage> findByUserOrderByCreatedAtAsc(User user);

    List<ChatMessage> findByUserIdOrderByCreatedAtAsc(UUID userId);

    Optional<ChatMessage> findFirstByUserOrderByCreatedAtDesc(User user);

    long countByUserAndIsReadByAdminFalse(User user);

    long countByUserAndIsReadByCustomerFalse(User user);

    long countByUserAndChannelIgnoreCaseAndIsReadByCustomerFalse(User user, String channel);

    @Query("SELECT DISTINCT cm.user FROM ChatMessage cm WHERE cm.user.role = com.mobilestore.user.entity.UserRole.ROLE_USER")
    List<User> findDistinctChatUsers();

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("UPDATE ChatMessage cm SET cm.isReadByCustomer = true WHERE cm.user = :user AND cm.senderRole = 'ADMIN' AND cm.isReadByCustomer = false AND UPPER(COALESCE(cm.channel, 'SUPPORT')) = UPPER(:channel)")
    void markChannelAsReadByCustomer(@Param("user") User user, @Param("channel") String channel);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("UPDATE ChatMessage cm SET cm.isReadByCustomer = true WHERE cm.user = :user AND cm.senderRole = 'ADMIN' AND cm.isReadByCustomer = false")
    void markAllAsReadByCustomer(@Param("user") User user);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("UPDATE ChatMessage cm SET cm.isReadByAdmin = true WHERE cm.user = :user AND cm.senderRole = 'CUSTOMER' AND cm.isReadByAdmin = false")
    void markAllAsReadByAdmin(@Param("user") User user);
}
