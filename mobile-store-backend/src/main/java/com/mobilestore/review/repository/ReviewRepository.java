package com.mobilestore.review.repository;

import com.mobilestore.review.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * ReviewRepository
 * Module: review
 * Spring Data JPA repository for customer testimonial and rating management.
 */
@Repository
public interface ReviewRepository extends JpaRepository<Review, UUID> {

    List<Review> findAllByOrderByCreatedAtDesc();

    Page<Review> findAllByOrderByCreatedAtDesc(Pageable pageable);

    List<Review> findTop8ByOrderByCreatedAtDesc();

    List<Review> findTop12ByOrderByCreatedAtDesc();

    List<Review> findByRatingGreaterThanEqualOrderByCreatedAtDesc(Integer minRating);

    Page<Review> findByRating(Integer rating, Pageable pageable);

    long countByRating(Integer rating);

    @Query("SELECT COALESCE(AVG(r.rating), 0.0) FROM Review r")
    Double calculateAverageRating();

    @Query("SELECT r FROM Review r WHERE " +
           "LOWER(r.customerName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(r.reviewText) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(r.purchasedPhone) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<Review> searchReviews(@Param("query") String query, Pageable pageable);
}
