package com.mobilestore.mobile.specification;

import com.mobilestore.mobile.entity.Mobile;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;

/**
 * MobileSpecification
 * Module: mobile
 * Dynamic JPA Criteria Specification builder for multi-criteria smartphone catalog search,
 * filtering, sorting, and centralized visibility enforcement.
 */
public final class MobileSpecification {

    private MobileSpecification() {
        // Utility class
    }

    /**
     * Permanent storefront visibility constraint.
     * Guarantees hidden products are structurally precluded from search results.
     */
    public static Specification<Mobile> isVisible() {
        return (root, query, cb) -> cb.isFalse(root.get("hidden"));
    }

    /**
     * Partial case-insensitive smartphone name matching (e.g., 'iPh' matches 'iPhone 16 Pro').
     */
    public static Specification<Mobile> hasNameLike(String name) {
        return (root, query, cb) -> {
            if (name == null || name.isBlank()) {
                return null;
            }
            return cb.like(cb.lower(root.get("name")), "%" + name.trim().toLowerCase() + "%");
        };
    }

    /**
     * Case-insensitive brand equality filter (e.g., 'Samsung', 'Apple').
     */
    public static Specification<Mobile> hasBrand(String brand) {
        return (root, query, cb) -> {
            if (brand == null || brand.isBlank()) {
                return null;
            }
            return cb.equal(cb.lower(root.get("brand")), brand.trim().toLowerCase());
        };
    }

    /**
     * Case-insensitive exact RAM specification filter (e.g., '8GB', '12GB', '16GB').
     */
    public static Specification<Mobile> hasRam(String ram) {
        return (root, query, cb) -> {
            if (ram == null || ram.isBlank()) {
                return null;
            }
            return cb.equal(cb.lower(root.get("ram")), ram.trim().toLowerCase());
        };
    }

    /**
     * Case-insensitive exact storage specification filter (e.g., '128GB', '256GB', '512GB', '1TB').
     */
    public static Specification<Mobile> hasStorage(String storage) {
        return (root, query, cb) -> {
            if (storage == null || storage.isBlank()) {
                return null;
            }
            return cb.equal(cb.lower(root.get("storage")), storage.trim().toLowerCase());
        };
    }

    /**
     * Partial case-insensitive processor matching (e.g., 'Snapdragon', 'Dimensity', 'Tensor').
     */
    public static Specification<Mobile> hasProcessorLike(String processor) {
        return (root, query, cb) -> {
            if (processor == null || processor.isBlank()) {
                return null;
            }
            return cb.like(cb.lower(root.get("processor")), "%" + processor.trim().toLowerCase() + "%");
        };
    }

    /**
     * Compose dynamic multi-criteria specification.
     * Evaluates only supplied non-blank query criteria while enforcing visibility.
     *
     * @param name Optional product name substring
     * @param brand Optional manufacturer brand
     * @param ram Optional exact RAM capacity
     * @param storage Optional exact internal storage capacity
     * @param processor Optional processor family/name substring
     * @return Combined JPA Specification
     */
    public static Specification<Mobile> buildSearchSpecification(
            String name,
            String brand,
            String ram,
            String storage,
            String processor
    ) {
        return Specification.where(isVisible())
                .and(hasNameLike(name))
                .and(hasBrand(brand))
                .and(hasRam(ram))
                .and(hasStorage(storage))
                .and(hasProcessorLike(processor));
    }

    /**
     * Resolve sort directive string into Spring Data Sort definition using SortBuilder.
     * Supported directives: 'normal' (default), 'price_asc', 'price_desc', 'latest'.
     *
     * @param sort Sort directive string
     * @return Configured Spring Data Sort instance
     */
    public static Sort resolveSort(String sort) {
        return com.mobilestore.util.SortBuilder.buildMobileSort(sort);
    }
}
