package com.mobilestore.compare.repository;

import com.mobilestore.compare.entity.CompareItem;
import com.mobilestore.mobile.entity.Mobile;
import com.mobilestore.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * CompareRepository
 * Module: compare
 * Spring Data JPA repository for customer smartphone comparison items.
 */
@Repository
public interface CompareRepository extends JpaRepository<CompareItem, UUID> {

    /**
     * Check if a specific mobile is already added to the customer's comparison list.
     */
    boolean existsByUserAndMobile(User user, Mobile mobile);

    /**
     * Retrieve all compared mobiles for a customer in chronological order.
     */
    List<CompareItem> findByUserOrderByCreatedAtAsc(User user);

    /**
     * Remove a specific mobile from customer's comparison list.
     */
    void deleteByUserAndMobile(User user, Mobile mobile);

    /**
     * Count the total number of compared mobiles for a customer (max 4).
     */
    long countByUser(User user);

    /**
     * Clear all compared mobiles for a customer.
     */
    void deleteAllByUser(User user);
}
