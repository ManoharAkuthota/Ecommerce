package com.mobilestore.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Collections;
import java.util.Date;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {

    private JwtService jwtService;

    @BeforeEach
    void setUp() {
        jwtService = new JwtService();
        ReflectionTestUtils.setField(
                jwtService,
                "secretKey",
                "antigravity_mobile_store_super_secret_jwt_key_2026_production_grade_token_signing_secret"
        );
        ReflectionTestUtils.setField(jwtService, "jwtExpiration", 3600000L); // 1 hour
    }

    @Test
    @DisplayName("Should successfully generate token and extract username")
    void shouldGenerateAndExtractUsername() {
        String email = "admin@antigravity.com";
        String token = jwtService.generateToken(email);

        assertNotNull(token);
        assertFalse(token.isBlank());

        String extracted = jwtService.extractUsername(token);
        assertEquals(email, extracted);
    }

    @Test
    @DisplayName("Should extract valid future expiration date")
    void shouldExtractExpiration() {
        String email = "admin@antigravity.com";
        String token = jwtService.generateToken(email);

        Date expiration = jwtService.extractExpiration(token);
        assertNotNull(expiration);
        assertTrue(expiration.after(new Date()));
    }

    @Test
    @DisplayName("Should validate token against matching UserDetails")
    void shouldValidateTokenWithUserDetails() {
        String email = "admin@antigravity.com";
        String token = jwtService.generateToken(email);

        UserDetails userDetails = new User(
                email,
                "password123",
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_ADMIN"))
        );

        assertTrue(jwtService.validateToken(token, userDetails));
        assertTrue(jwtService.validateToken(token));
    }

    @Test
    @DisplayName("Should reject token when validated against different UserDetails")
    void shouldRejectTokenForDifferentUserDetails() {
        String token = jwtService.generateToken("admin@antigravity.com");

        UserDetails differentUser = new User(
                "other@antigravity.com",
                "password123",
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_ADMIN"))
        );

        assertFalse(jwtService.validateToken(token, differentUser));
    }

    @Test
    @DisplayName("Should support extra custom claims")
    void shouldSupportExtraClaims() {
        String email = "admin@antigravity.com";
        Map<String, Object> claims = Map.of("role", "ROLE_ADMIN", "tenantId", "antigravity");
        String token = jwtService.generateToken(claims, email);

        assertEquals(email, jwtService.extractUsername(token));
        assertEquals("ROLE_ADMIN", jwtService.extractClaim(token, c -> c.get("role", String.class)));
        assertEquals("antigravity", jwtService.extractClaim(token, c -> c.get("tenantId", String.class)));
    }

    @Test
    @DisplayName("Should return false for invalid or tampered token")
    void shouldRejectInvalidToken() {
        assertFalse(jwtService.validateToken("invalid.jwt.token"));
        assertFalse(jwtService.validateToken(""));
    }
}
