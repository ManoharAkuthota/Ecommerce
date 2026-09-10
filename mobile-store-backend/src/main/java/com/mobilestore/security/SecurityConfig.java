package com.mobilestore.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

/**
 * SecurityConfig
 * Module: security
 * Production-ready Spring Security 6 configuration:
 * - Stateless JWT authentication
 * - Cross-Origin Resource Sharing (CORS)
 * - CSRF protection disabled for stateless REST API
 * - Custom 401 JSON authentication entry point
 * - Granular route authorization (Public vs Admin Role-Protected)
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final CustomUserDetailsService customUserDetailsService;
    private final CustomAuthenticationEntryPoint customAuthenticationEntryPoint;
    private final CorsConfigurationSource corsConfigurationSource;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter,
            CustomUserDetailsService customUserDetailsService,
            CustomAuthenticationEntryPoint customAuthenticationEntryPoint,
            CorsConfigurationSource corsConfigurationSource
    ) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.customUserDetailsService = customUserDetailsService;
        this.customAuthenticationEntryPoint = customAuthenticationEntryPoint;
        this.corsConfigurationSource = corsConfigurationSource;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(customUserDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(exception -> exception.authenticationEntryPoint(customAuthenticationEntryPoint))
                .authenticationProvider(authenticationProvider())
                .authorizeHttpRequests(auth -> auth
                        // Public GET endpoints
                        .requestMatchers(HttpMethod.GET, SecurityConstants.PUBLIC_GET_URLS).permitAll()
                        // Public POST endpoints
                        .requestMatchers(HttpMethod.POST, SecurityConstants.PUBLIC_POST_URLS).permitAll()
                        // Public general error dispatcher
                        .requestMatchers("/error").permitAll()

                        // Public User Authentication endpoints
                        .requestMatchers("/api/auth/**").permitAll()

                        // Protected User, Account, Live Chat & Order routes (requires authentication)
                        .requestMatchers("/api/account/**", "/api/user/**", "/api/chat/**", "/api/orders/**").authenticated()

                        // Protected Mobile CRUD mutations (requires ROLE_ADMIN)
                        .requestMatchers(HttpMethod.POST, "/api/mobiles", "/api/mobiles/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/mobiles", "/api/mobiles/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PATCH, "/api/mobiles", "/api/mobiles/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/mobiles", "/api/mobiles/**").hasRole("ADMIN")

                        // Protected Review management operations (requires ROLE_ADMIN)
                        .requestMatchers(HttpMethod.DELETE, "/api/reviews", "/api/reviews/**").hasRole("ADMIN")

                        // Protected Contact inbox management (requires ROLE_ADMIN)
                        .requestMatchers(HttpMethod.GET, "/api/contact", "/api/contact/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/contact", "/api/contact/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PATCH, "/api/contact", "/api/contact/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/contact", "/api/contact/**").hasRole("ADMIN")

                        // Administrative routes
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")

                        // All other endpoints require authentication
                        .anyRequest().authenticated()
                );

        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
