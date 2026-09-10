package com.mobilestore.wishlist.repository;

import com.mobilestore.mobile.entity.Mobile;
import com.mobilestore.user.entity.User;
import com.mobilestore.wishlist.entity.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * WishlistRepository
 * Module: wishlist
 * Spring Data JPA repository managing customer wishlist persistence.
 * Uses derived query methods to optimize performance.
 */
@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, UUID> {

    boolean existsByUserAndMobile(User user, Mobile mobile);

    List<Wishlist> findByUserOrderByCreatedAtDesc(User user);

    Optional<Wishlist> findByUserAndMobile(User user, Mobile mobile);

    void deleteByUserAndMobile(User user, Mobile mobile);

    long countByUser(User user);
}
