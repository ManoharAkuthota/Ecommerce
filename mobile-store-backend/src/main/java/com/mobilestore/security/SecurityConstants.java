package com.mobilestore.security;

/**
 * SecurityConstants
 * Module: security
 * Central constants for Spring Security and JWT authentication infrastructure.
 */
public final class SecurityConstants {

    private SecurityConstants() {
        // Prevent instantiation
    }

    public static final String AUTHORIZATION_HEADER = "Authorization";
    public static final String BEARER_PREFIX = "Bearer ";
    public static final String ROLE_ADMIN = "ROLE_ADMIN";
    public static final String ROLE_USER = "ROLE_USER";

    public static final String[] PUBLIC_GET_URLS = {
            "/api/mobiles",
            "/api/mobiles/**",
            "/api/reviews",
            "/api/reviews/**",
            "/api/health",
            "/api/orders/lookup/**",
            "/error"
    };

    public static final String[] PUBLIC_POST_URLS = {
            "/api/reviews",
            "/api/contact",
            "/api/admin/login",
            "/api/auth/login",
            "/api/auth/register",
            "/api/orders/coupon/validate"
    };
}
