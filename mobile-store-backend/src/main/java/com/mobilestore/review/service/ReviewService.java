package com.mobilestore.review.service;

import com.mobilestore.review.dto.ReviewRequest;
import com.mobilestore.review.dto.ReviewResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

/**
 * ReviewService
 * Module: review
 * Service contract for customer review management, testimonial carousel showcase,
 * and rating metrics operations.
 */
public interface ReviewService {

    /**
     * Submit and save a customer review.
     *
     * @param request Validated review payload
     * @return ReviewResponse representation of the created review
     */
    ReviewResponse addReview(ReviewRequest request);

    /**
     * Retrieve all customer reviews ordered by latest first.
     *
     * @return List of ReviewResponse objects
     */
    List<ReviewResponse> getAllReviews();

    /**
     * Retrieve a paginated list of reviews ordered by latest first.
     *
     * @param pageable Pagination and sorting criteria
     * @return Page of ReviewResponse objects
     */
    Page<ReviewResponse> getReviews(Pageable pageable);

    /**
     * Retrieve the top 8 latest customer reviews for the homepage showcase.
     *
     * @return List of 8 latest ReviewResponse objects
     */
    List<ReviewResponse> getLatestReviews();

    /**
     * Retrieve the top 12 latest reviews for the infinite customer stories marquee.
     *
     * @return List of 12 latest ReviewResponse objects
     */
    List<ReviewResponse> getFeaturedReviews();

    /**
     * Retrieve a single customer review by its unique identifier.
     *
     * @param id Review unique identifier
     * @return ReviewResponse review details
     */
    ReviewResponse getReviewById(UUID id);

    /**
     * Delete a customer review by its unique identifier.
     *
     * @param id Review unique identifier
     */
    void deleteReview(UUID id);

    /**
     * Calculate and retrieve the global average rating across all customer reviews.
     *
     * @return Average rating formatted as a Double (e.g., 4.8)
     */
    Double getAverageRating();

    /**
     * Count total customer reviews in the system.
     *
     * @return Total review count
     */
    long countReviews();
}
