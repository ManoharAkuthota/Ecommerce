package com.mobilestore.compare.service;

import com.mobilestore.compare.dto.CompareResponse;

import java.util.UUID;

/**
 * CompareService
 * Module: compare
 * Business service interface managing customer smartphone comparisons.
 */
public interface CompareService {

    /**
     * Add a mobile to customer's comparison list.
     * Enforces maximum 4 items limit and prevents duplicates.
     */
    CompareResponse addToCompare(String userEmail, UUID mobileId);

    /**
     * Retrieve all compared mobiles for a customer.
     */
    CompareResponse getComparison(String userEmail);

    /**
     * Remove a single mobile from customer's comparison list.
     */
    CompareResponse removeFromCompare(String userEmail, UUID mobileId);

    /**
     * Clear all compared mobiles for a customer.
     */
    CompareResponse clearComparison(String userEmail);

    /**
     * Retrieve count of compared mobiles for a customer.
     */
    long getCompareCount(String userEmail);
}
