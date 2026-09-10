package com.mobilestore.wishlist.service;

import com.mobilestore.wishlist.dto.WishlistResponse;

import java.util.UUID;

/**
 * WishlistService
 * Module: wishlist
 * Service contract managing customer wishlist additions, removals, and queries.
 */
public interface WishlistService {

    /**
     * Retrieve the customer's full saved wishlist.
     *
     * @param userEmail Authenticated customer email address
     * @return WishlistResponse containing saved smartphone items and count
     */
    WishlistResponse getWishlist(String userEmail);

    /**
     * Add a smartphone product to the customer's wishlist idempotently.
     *
     * @param userEmail Authenticated customer email address
     * @param mobileId UUID identifier of the smartphone
     * @return Updated WishlistResponse
     */
    WishlistResponse addToWishlist(String userEmail, UUID mobileId);

    /**
     * Remove a smartphone product from the customer's wishlist gracefully.
     *
     * @param userEmail Authenticated customer email address
     * @param mobileId UUID identifier of the smartphone
     * @return Updated WishlistResponse
     */
    WishlistResponse removeFromWishlist(String userEmail, UUID mobileId);

    /**
     * Retrieve total number of items in the customer's wishlist.
     *
     * @param userEmail Authenticated customer email address
     * @return Total count of saved items
     */
    long getWishlistCount(String userEmail);
}
