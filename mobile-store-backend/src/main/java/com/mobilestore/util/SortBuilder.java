package com.mobilestore.util;

import com.mobilestore.exception.InvalidSortOptionException;
import org.springframework.data.domain.Sort;

import java.util.Map;
import java.util.Set;

/**
 * SortBuilder
 * Module: common / util
 * Generic and reusable sorting utility for converting API query parameters into
 * validated Spring Data Sort definitions for database queries.
 */
public final class SortBuilder {

    public static final String SORT_NORMAL = "normal";
    public static final String SORT_PRICE_ASC = "price_asc";
    public static final String SORT_PRICE_DESC = "price_desc";
    public static final String SORT_LATEST = "latest";

    private static final Set<String> ALLOWED_SORT_OPTIONS = Set.of(
            SORT_NORMAL,
            SORT_PRICE_ASC,
            SORT_PRICE_DESC,
            SORT_LATEST
    );

    private static final Map<String, Sort> SORT_MAPPING = Map.of(
            SORT_NORMAL, Sort.by(Sort.Direction.DESC, "createdAt"),
            SORT_LATEST, Sort.by(Sort.Direction.DESC, "createdAt"),
            SORT_PRICE_ASC, Sort.by(Sort.Direction.ASC, "price"),
            SORT_PRICE_DESC, Sort.by(Sort.Direction.DESC, "price")
    );

    private SortBuilder() {
        // Utility class
    }

    /**
     * Build and validate a Spring Data Sort instance from an incoming query parameter.
     *
     * @param sort Directive ('normal', 'price_asc', 'price_desc', 'latest'). If null/blank, defaults to 'normal'.
     * @return Configured Spring Data Sort instance
     * @throws InvalidSortOptionException when sort parameter is not recognized
     */
    public static Sort buildMobileSort(String sort) {
        if (sort == null || sort.isBlank()) {
            return SORT_MAPPING.get(SORT_NORMAL);
        }

        String normalized = sort.trim().toLowerCase();
        if (!ALLOWED_SORT_OPTIONS.contains(normalized)) {
            throw new InvalidSortOptionException(sort.trim());
        }

        return SORT_MAPPING.get(normalized);
    }

    /**
     * Retrieve the set of all supported sort option keys.
     *
     * @return Set of allowed sort parameter strings
     */
    public static Set<String> getAllowedSortOptions() {
        return ALLOWED_SORT_OPTIONS;
    }
}
