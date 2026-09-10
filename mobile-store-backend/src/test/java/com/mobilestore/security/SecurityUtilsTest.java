package com.mobilestore.security;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

class SecurityUtilsTest {

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    @DisplayName("Should return empty when SecurityContext is unauthenticated")
    void unauthenticatedContext() {
        SecurityContextHolder.clearContext();

        assertFalse(SecurityUtils.isAuthenticated());
        assertEquals(Optional.empty(), SecurityUtils.getCurrentUserEmail());
        assertFalse(SecurityUtils.hasRole("ADMIN"));
    }

    @Test
    @DisplayName("Should return correct details when authenticated with UserDetails")
    void authenticatedWithUserDetails() {
        UserDetails user = new User(
                "admin@antigravity.com",
                "password",
                List.of(new SimpleGrantedAuthority("ROLE_ADMIN"))
        );
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());

        SecurityContextHolder.getContext().setAuthentication(auth);

        assertTrue(SecurityUtils.isAuthenticated());
        assertEquals(Optional.of("admin@antigravity.com"), SecurityUtils.getCurrentUserEmail());
        assertTrue(SecurityUtils.hasRole("ADMIN"));
        assertTrue(SecurityUtils.hasRole("ROLE_ADMIN"));
        assertFalse(SecurityUtils.hasRole("USER"));
    }

    @Test
    @DisplayName("Should return false when principal is AnonymousAuthenticationToken")
    void anonymousAuthentication() {
        AnonymousAuthenticationToken anonAuth = new AnonymousAuthenticationToken(
                "key",
                "anonymousUser",
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_ANONYMOUS"))
        );
        SecurityContextHolder.getContext().setAuthentication(anonAuth);

        assertFalse(SecurityUtils.isAuthenticated());
        assertEquals(Optional.empty(), SecurityUtils.getCurrentUserEmail());
        assertFalse(SecurityUtils.hasRole("ADMIN"));
    }
}
