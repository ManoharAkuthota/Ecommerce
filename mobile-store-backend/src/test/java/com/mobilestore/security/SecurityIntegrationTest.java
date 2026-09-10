package com.mobilestore.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mobilestore.contact.dto.ContactRequest;
import com.mobilestore.mobile.dto.UpdateVisibilityRequest;
import com.mobilestore.review.dto.ReviewRequest;
import io.jsonwebtoken.Jwts;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Date;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class SecurityIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private com.mobilestore.mobile.repository.MobileRepository mobileRepository;

    private String generateExpiredToken(String username) {
        return Jwts.builder()
                .subject(username)
                .issuedAt(new Date(System.currentTimeMillis() - 7200000))
                .expiration(new Date(System.currentTimeMillis() - 3600000))
                .signWith(new SecretKeySpec(
                        "antigravity_mobile_store_super_secret_jwt_key_2026_production_grade_token_signing_secret".getBytes(StandardCharsets.UTF_8),
                        "HmacSHA256"
                ), Jwts.SIG.HS256)
                .compact();
    }

    @Test
    @DisplayName("Public GET /api/mobiles should be accessible without token")
    void publicGetMobilesAccessible() throws Exception {
        mockMvc.perform(get("/api/mobiles"))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Public GET /api/reviews/latest should be accessible without token")
    void publicGetReviewsLatestAccessible() throws Exception {
        mockMvc.perform(get("/api/reviews/latest"))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Public POST /api/reviews should be accessible without token")
    void publicPostReviewAccessible() throws Exception {
        ReviewRequest request = ReviewRequest.builder()
                .customerName("Integration Tester")
                .purchasedPhone("iPhone 16 Pro Max")
                .rating(5)
                .reviewText("Integration test review submission.")
                .build();

        mockMvc.perform(post("/api/reviews")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());
    }

    @Test
    @DisplayName("Public POST /api/contact should be accessible without token")
    void publicPostContactAccessible() throws Exception {
        ContactRequest request = ContactRequest.builder()
                .name("Integration Tester")
                .email("tester@antigravity.com")
                .phone("+1234567890")
                .message("Integration test contact message submission.")
                .build();

        mockMvc.perform(post("/api/contact")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());
    }

    @Test
    @DisplayName("Protected POST /api/mobiles without token should return 401 Authentication required")
    void protectedPostMobilesRejectsUnauthenticated() throws Exception {
        mockMvc.perform(post("/api/mobiles")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.status").value(401))
                .andExpect(jsonPath("$.error").value("Unauthorized"))
                .andExpect(jsonPath("$.message").value("Authentication required"));
    }

    @Test
    @DisplayName("Protected PATCH visibility without token should return 401 Authentication required")
    void protectedPatchVisibilityRejectsUnauthenticated() throws Exception {
        mockMvc.perform(patch("/api/mobiles/a0000000-0000-0000-0000-000000000001/visibility")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"hidden\":false}"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.status").value(401))
                .andExpect(jsonPath("$.error").value("Unauthorized"))
                .andExpect(jsonPath("$.message").value("Authentication required"));
    }

    @Test
    @DisplayName("Protected DELETE review without token should return 401 Authentication required")
    void protectedDeleteReviewRejectsUnauthenticated() throws Exception {
        mockMvc.perform(delete("/api/reviews/a0000000-0000-0000-0000-000000000001"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.status").value(401))
                .andExpect(jsonPath("$.error").value("Unauthorized"))
                .andExpect(jsonPath("$.message").value("Authentication required"));
    }

    @Test
    @DisplayName("Protected endpoint with invalid token should return 401 Invalid or expired token")
    void protectedEndpointWithInvalidTokenRejects() throws Exception {
        mockMvc.perform(patch("/api/mobiles/a0000000-0000-0000-0000-000000000001/visibility")
                        .header("Authorization", "Bearer invalid.tampered.token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"hidden\":false}"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.status").value(401))
                .andExpect(jsonPath("$.error").value("Unauthorized"))
                .andExpect(jsonPath("$.message").value("Invalid or expired token"));
    }

    @Test
    @DisplayName("Protected endpoint with expired token should return 401 Invalid or expired token")
    void protectedEndpointWithExpiredTokenRejects() throws Exception {
        String expiredToken = generateExpiredToken("admin@antigravity.com");

        mockMvc.perform(patch("/api/mobiles/a0000000-0000-0000-0000-000000000001/visibility")
                        .header("Authorization", "Bearer " + expiredToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"hidden\":false}"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.status").value(401))
                .andExpect(jsonPath("$.error").value("Unauthorized"))
                .andExpect(jsonPath("$.message").value("Invalid or expired token"));
    }

    @Test
    @DisplayName("Protected PATCH visibility with valid admin JWT should succeed")
    void protectedPatchVisibilityWithValidAdminJwtSucceeds() throws Exception {
        String adminToken = jwtService.generateToken("admin@antigravity.com");
        UpdateVisibilityRequest request = new UpdateVisibilityRequest(false);

        java.util.UUID mobileId = mobileRepository.findAll().get(0).getId();
        mockMvc.perform(patch("/api/mobiles/" + mobileId + "/visibility")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(mobileId.toString()))
                .andExpect(jsonPath("$.hidden").value(false));
    }

    @Test
    @DisplayName("CORS preflight request from localhost:5173 should return allowed headers")
    void corsPreflightSucceeds() throws Exception {
        mockMvc.perform(options("/api/mobiles")
                        .header("Origin", "http://localhost:5173")
                        .header("Access-Control-Request-Method", "POST")
                        .header("Access-Control-Request-Headers", "Authorization,Content-Type"))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:5173"))
                .andExpect(header().string("Access-Control-Allow-Credentials", "true"));
    }
}
