package com.mobilestore.security;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.SignatureException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * JwtAuthenticationFilter
 * Module: security
 * Intercepts incoming HTTP requests, extracts JWT bearer tokens, validates credentials,
 * categorizes authentication errors, and populates the Spring SecurityContextHolder.
 */
@Slf4j
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    public static final String JWT_AUTH_ERROR_ATTRIBUTE = "jwt_auth_error";

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    public JwtAuthenticationFilter(JwtService jwtService, UserDetailsService userDetailsService) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        final String authHeader = request.getHeader(SecurityConstants.AUTHORIZATION_HEADER);

        if (StringUtils.hasText(authHeader) && authHeader.startsWith(SecurityConstants.BEARER_PREFIX)) {
            final String jwt = authHeader.substring(SecurityConstants.BEARER_PREFIX.length()).trim();

            if (StringUtils.hasText(jwt)) {
                try {
                    final String userEmail = jwtService.extractUsername(jwt);

                    if (StringUtils.hasText(userEmail) && SecurityContextHolder.getContext().getAuthentication() == null) {
                        UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);

                        if (jwtService.validateToken(jwt, userDetails)) {
                            UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    userDetails.getAuthorities()
                            );
                            authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                            SecurityContextHolder.getContext().setAuthentication(authToken);
                            log.debug("SecurityContext populated for authenticated user: {}", userEmail);
                        } else {
                            log.warn("Token validation returned false for user: {}", userEmail);
                            request.setAttribute(JWT_AUTH_ERROR_ATTRIBUTE, "Invalid or expired token");
                        }
                    }
                } catch (ExpiredJwtException ex) {
                    log.warn("Expired JWT token encountered for URI: {}", request.getRequestURI());
                    request.setAttribute(JWT_AUTH_ERROR_ATTRIBUTE, "Invalid or expired token");
                } catch (SignatureException ex) {
                    log.warn("Invalid JWT signature encountered for URI: {}", request.getRequestURI());
                    request.setAttribute(JWT_AUTH_ERROR_ATTRIBUTE, "Invalid or expired token");
                } catch (MalformedJwtException ex) {
                    log.warn("Malformed JWT token encountered for URI: {}", request.getRequestURI());
                    request.setAttribute(JWT_AUTH_ERROR_ATTRIBUTE, "Invalid or expired token");
                } catch (UnsupportedJwtException ex) {
                    log.warn("Unsupported JWT token encountered for URI: {}", request.getRequestURI());
                    request.setAttribute(JWT_AUTH_ERROR_ATTRIBUTE, "Invalid or expired token");
                } catch (UsernameNotFoundException ex) {
                    log.warn("JWT subject user not found in database: {}", ex.getMessage());
                    request.setAttribute(JWT_AUTH_ERROR_ATTRIBUTE, "Invalid or expired token");
                } catch (Exception ex) {
                    log.warn("Failed to process JWT authentication token: {}", ex.getMessage());
                    request.setAttribute(JWT_AUTH_ERROR_ATTRIBUTE, "Invalid or expired token");
                }
            } else {
                log.warn("Empty Bearer token in Authorization header for URI: {}", request.getRequestURI());
                request.setAttribute(JWT_AUTH_ERROR_ATTRIBUTE, "Invalid or expired token");
            }
        }

        filterChain.doFilter(request, response);
    }
}
