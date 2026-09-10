package com.mobilestore.review.service.impl;

import com.mobilestore.exception.BadRequestException;
import com.mobilestore.exception.ResourceNotFoundException;
import com.mobilestore.exception.ReviewNotFoundException;
import com.mobilestore.review.dto.ReviewRequest;
import com.mobilestore.review.dto.ReviewResponse;
import com.mobilestore.review.entity.Review;
import com.mobilestore.review.repository.ReviewRepository;
import com.mobilestore.review.service.ReviewService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

/**
 * ReviewServiceImpl
 * Module: review
 * Enterprise implementation of the ReviewService interface.
 * Manages customer testimonials, 1-5 star ratings, and marquee showcase retrieval.
 */
@Slf4j
@Service
@Transactional(readOnly = true)
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;

    /**
     * Constructor injection for required dependencies.
     */
    public ReviewServiceImpl(ReviewRepository reviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    @Override
    @Transactional
    public ReviewResponse addReview(ReviewRequest request) {
        log.info("Submitting new review from customer: {}", request.getCustomerName());

        validateRating(request.getRating());

        Review review = mapToEntity(request);
        Review saved = reviewRepository.save(review);
        log.info("Review created successfully with ID: {}, customer: '{}', phone: '{}', rating: {}",
                saved.getId(), saved.getCustomerName(), saved.getPurchasedPhone(), saved.getRating());

        return mapToResponse(saved);
    }

    @Override
    public List<ReviewResponse> getAllReviews() {
        log.debug("Fetching all reviews ordered by latest first");
        return reviewRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public Page<ReviewResponse> getReviews(Pageable pageable) {
        log.debug("Fetching paginated reviews: page={}, size={}", pageable.getPageNumber(), pageable.getPageSize());
        return reviewRepository.findAllByOrderByCreatedAtDesc(pageable)
                .map(this::mapToResponse);
    }

    @Override
    public List<ReviewResponse> getLatestReviews() {
        log.info("Latest reviews requested (top 8 newest reviews)");
        return reviewRepository.findTop8ByOrderByCreatedAtDesc().stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public List<ReviewResponse> getFeaturedReviews() {
        log.debug("Fetching top 12 featured reviews for infinite marquee");
        return reviewRepository.findTop12ByOrderByCreatedAtDesc().stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public ReviewResponse getReviewById(UUID id) {
        log.debug("Fetching review with ID: {}", id);
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ReviewNotFoundException(id));
        return mapToResponse(review);
    }

    @Override
    @Transactional
    public void deleteReview(UUID id) {
        log.info("Deleting review with ID: {}", id);

        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ReviewNotFoundException(id));

        reviewRepository.delete(review);
        log.info("Review deleted successfully with ID: {}", id);
    }

    @Override
    public Double getAverageRating() {
        Double avg = reviewRepository.calculateAverageRating();
        log.debug("Calculated average review rating: {}", avg);
        return avg != null ? Math.round(avg * 10.0) / 10.0 : 0.0;
    }

    @Override
    public long countReviews() {
        return reviewRepository.count();
    }

    // =========================================================================
    // Reusable Private Mapping & Validation Helpers
    // =========================================================================

    private void validateRating(Integer rating) {
        if (rating == null || rating < 1 || rating > 5) {
            throw new BadRequestException("Rating must be between 1 and 5 stars");
        }
    }

    private Review mapToEntity(ReviewRequest request) {
        String avatar = (request.getCustomerImage() != null && !request.getCustomerImage().isBlank())
                ? request.getCustomerImage().trim()
                : null;

        String phone = (request.getPurchasedPhone() != null && !request.getPurchasedPhone().isBlank())
                ? request.getPurchasedPhone().trim()
                : null;

        return Review.builder()
                .customerName(request.getCustomerName().trim())
                .customerImage(avatar)
                .purchasedPhone(phone)
                .rating(request.getRating())
                .reviewText(request.getReviewText().trim())
                .build();
    }

    private ReviewResponse mapToResponse(Review review) {
        return ReviewResponse.builder()
                .id(review.getId())
                .customerName(review.getCustomerName())
                .customerImage(review.getCustomerImage())
                .purchasedPhone(review.getPurchasedPhone())
                .rating(review.getRating())
                .reviewText(review.getReviewText())
                .createdAt(review.getCreatedAt())
                .build();
    }
}
