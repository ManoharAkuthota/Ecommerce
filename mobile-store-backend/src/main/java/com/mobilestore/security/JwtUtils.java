package com.mobilestore.security;

import org.springframework.stereotype.Component;

/**
 * Utility adapter for JWT operations, delegating to the primary JwtService.
 * Retained for backwards compatibility across existing service components.
 */
@Component
public class JwtUtils {

    private final JwtService jwtService;

    public JwtUtils(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    public String generateToken(String username) {
        return jwtService.generateToken(username);
    }

    public String getUsernameFromToken(String token) {
        return jwtService.extractUsername(token);
    }

    public boolean validateToken(String token) {
        return jwtService.validateToken(token);
    }
}
