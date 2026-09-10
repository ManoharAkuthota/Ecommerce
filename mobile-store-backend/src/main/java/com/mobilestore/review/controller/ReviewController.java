package com.mobilestore.review.controller;

import com.mobilestore.review.dto.ReviewRequest;
import com.mobilestore.review.dto.ReviewResponse;
import com.mobilestore.review.service.ReviewService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * ReviewController
 * Module: review
 * REST Controller exposing customer testimonial listing, marquee showcase,
 * review submission, and rating metrics endpoints.
 */
@Slf4j
@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    /**
     * Constructor injection for ReviewService.
     */
    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    /**
     * GET /api/reviews
     * Retrieve all customer reviews sorted latest first.
     * Optionally supports pagination when page and size query parameters are provided.
     *
     * @param page Optional zero-based page index
     * @param size Optional page size
     * @return HTTP 200 with list or page of ReviewResponse DTOs
     */
    @GetMapping
    public ResponseEntity<?> getAllReviews(
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size
    ) {
        if (page != null && size != null) {
            log.info("REST request to fetch paginated customer reviews: page={}, size={}", page, size);
            org.springframework.data.domain.Pageable pageable =
                    org.springframework.data.domain.PageRequest.of(page, size);
            return ResponseEntity.ok(reviewService.getReviews(pageable));
        }
        log.info("REST request to fetch all customer reviews");
        List<ReviewResponse> reviews = reviewService.getAllReviews();
        return ResponseEntity.ok(reviews);
    }

    /**
     * GET /api/reviews/latest
     * Retrieve the top 8 latest customer reviews for the homepage showcase.
     * Ordered by createdAt descending.
     *
     * @return HTTP 200 with list of 8 latest ReviewResponse DTOs
     */
    @GetMapping("/latest")
    public ResponseEntity<List<ReviewResponse>> getLatestReviews() {
        log.info("REST request to fetch latest 8 customer reviews for homepage");
        List<ReviewResponse> latest = reviewService.getLatestReviews();
        return ResponseEntity.ok(latest);
    }

    /**
     * GET /api/reviews/featured
     * Retrieve the top 12 latest customer reviews to power the infinite testimonial marquee.
     *
     * @return HTTP 200 with list of 12 featured ReviewResponse DTOs
     */
    @GetMapping("/featured")
    public ResponseEntity<List<ReviewResponse>> getFeaturedReviews() {
        log.info("REST request to fetch featured customer reviews for marquee");
        List<ReviewResponse> featured = reviewService.getFeaturedReviews();
        return ResponseEntity.ok(featured);
    }

    /**
     * GET /api/reviews/{id}
     * Retrieve a specific customer review by its UUID.
     *
     * @param id Review unique identifier
     * @return HTTP 200 with ReviewResponse DTO
     */
    @GetMapping("/{id}")
    public ResponseEntity<ReviewResponse> getReviewById(@PathVariable UUID id) {
        log.info("REST request to fetch review with ID: {}", id);
        ReviewResponse review = reviewService.getReviewById(id);
        return ResponseEntity.ok(review);
    }

    /**
     * POST /api/reviews
     * Submit and persist a new customer review.
     *
     * @param request Validated review payload
     * @return HTTP 201 Created with saved ReviewResponse DTO
     */
    @PostMapping
    public ResponseEntity<ReviewResponse> addReview(@Valid @RequestBody ReviewRequest request) {
        log.info("REST request to submit review by customer: {}", request.getCustomerName());
        ReviewResponse created = reviewService.addReview(request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    /**
     * DELETE /api/reviews/{id}
     * Delete a customer review by its UUID.
     *
     * @param id Review unique identifier
     * @return HTTP 204 No Content
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable UUID id) {
        log.info("REST request to delete review with ID: {}", id);
        reviewService.deleteReview(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * GET /api/reviews/average
     * Retrieve the global customer rating average (e.g., 4.8).
     *
     * @return HTTP 200 with average rating score
     */
    @GetMapping("/average")
    public ResponseEntity<Map<String, Double>> getAverageRating() {
        log.info("REST request to fetch average customer rating");
        Double avg = reviewService.getAverageRating();
        return ResponseEntity.ok(Map.of("averageRating", avg));
    }
}
