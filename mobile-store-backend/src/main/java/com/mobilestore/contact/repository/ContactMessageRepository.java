package com.mobilestore.contact.repository;

import com.mobilestore.contact.entity.ContactMessage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * ContactMessageRepository
 * Module: contact
 * Spring Data JPA repository for customer concierge and contact form submissions.
 */
@Repository
public interface ContactMessageRepository extends JpaRepository<ContactMessage, UUID> {

    List<ContactMessage> findAllByOrderByCreatedAtDesc();

    Page<ContactMessage> findAllByOrderByCreatedAtDesc(Pageable pageable);

    List<ContactMessage> findByEmailIgnoreCaseOrderByCreatedAtDesc(String email);

    Page<ContactMessage> findByEmailIgnoreCase(String email, Pageable pageable);

    Page<ContactMessage> findByNameContainingIgnoreCase(String name, Pageable pageable);

    @Query("SELECT cm FROM ContactMessage cm WHERE " +
           "LOWER(cm.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(cm.email) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(cm.message) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<ContactMessage> searchMessages(@Param("query") String query, Pageable pageable);

    long countByEmailIgnoreCase(String email);
}
