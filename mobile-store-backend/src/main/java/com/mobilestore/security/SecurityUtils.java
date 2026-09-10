package com.mobilestore.security;

import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Optional;

/**
 * SecurityUtils
 * Module: security
 * Reusable utility class for interacting with the Spring SecurityContext.
 * Provides helper methods to obtain the currently authenticated user's email,
 * authentication status, and authority verification.
 */
public final class SecurityUtils {

    private SecurityUtils() {
        // Prevent instantiation
    }

    /**
     * Retrieves the currently authenticated user's email / username.
     *
     * @return Optional containing the authenticated email, or empty if unauthenticated.
     */
    public static Optional<String> getCurrentUserEmail() {
        Authentication authentication = getAuthentication();

        if (authentication == null || !authentication.isAuthenticated() || authentication instanceof AnonymousAuthenticationToken) {
            return Optional.empty();
        }

        Object principal = authentication.getPrincipal();
        if (principal instanceof UserDetails userDetails) {
            return Optional.ofNullable(userDetails.getUsername());
        } else if (principal instanceof String principalString && !"anonymousUser".equalsIgnoreCase(principalString)) {
            return Optional.of(principalString);
        }

        return Optional.empty();
    }

    /**
     * Checks whether the current request is authenticated.
     *
     * @return true if an authenticated non-anonymous principal exists, false otherwise.
     */
    public static boolean isAuthenticated() {
        Authentication authentication = getAuthentication();
        return authentication != null
                && authentication.isAuthenticated()
                && !(authentication instanceof AnonymousAuthenticationToken)
                && !"anonymousUser".equalsIgnoreCase(String.valueOf(authentication.getPrincipal()));
    }

    /**
     * Verifies if the authenticated user possesses a specific role/authority.
     * Automatically handles "ROLE_" prefix differences.
     *
     * @param role The role name to check (e.g., "ADMIN" or "ROLE_ADMIN")
     * @return true if user has the authority, false otherwise.
     */
    public static boolean hasRole(String role) {
        Authentication authentication = getAuthentication();
        if (authentication == null || !isAuthenticated() || role == null) {
            return false;
        }

        String targetAuthority = role.startsWith("ROLE_") ? role : "ROLE_" + role;
        for (GrantedAuthority authority : authentication.getAuthorities()) {
            if (authority.getAuthority().equalsIgnoreCase(targetAuthority)
                    || authority.getAuthority().equalsIgnoreCase(role)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Obtains the raw Authentication object from the current SecurityContext.
     *
     * @return Authentication instance, or null if context is empty.
     */
    public static Authentication getAuthentication() {
        return SecurityContextHolder.getContext().getAuthentication();
    }
}
