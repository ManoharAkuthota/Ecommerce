package com.mobilestore.admin;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mobilestore.admin.dto.AdminLoginRequest;
import com.mobilestore.admin.dto.AdminLoginResponse;
import com.mobilestore.mobile.dto.UpdateVisibilityRequest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class AdminLoginIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("POST /api/admin/login with valid credentials should return 200 and valid JWT")
    void validLoginReturns200AndToken() throws Exception {
        AdminLoginRequest request = new AdminLoginRequest("admin@antigravity.com", "admin123");

        MvcResult result = mockMvc.perform(post("/api/admin/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.tokenType").value("Bearer"))
                .andExpect(jsonPath("$.adminName").value("Super Admin"))
                .andExpect(jsonPath("$.email").value("admin@antigravity.com"))
                .andExpect(jsonPath("$.expiresAt").isNotEmpty())
                .andReturn();

        String jsonResponse = result.getResponse().getContentAsString();
        AdminLoginResponse response = objectMapper.readValue(jsonResponse, AdminLoginResponse.class);

        assertNotNull(response.getToken());
        assertFalse(response.getToken().isBlank());

        // Verify the emitted token can access protected endpoints
        UpdateVisibilityRequest visRequest = new UpdateVisibilityRequest(false);
        mockMvc.perform(patch("/api/mobiles/a0000000-0000-0000-0000-000000000001/visibility")
                        .header("Authorization", "Bearer " + response.getToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(visRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("a0000000-0000-0000-0000-000000000001"));
    }

    @Test
    @DisplayName("POST /api/admin/login with wrong password should return 401 Unauthorized")
    void wrongPasswordReturns401() throws Exception {
        AdminLoginRequest request = new AdminLoginRequest("admin@antigravity.com", "wrongPassword");

        mockMvc.perform(post("/api/admin/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value(401))
                .andExpect(jsonPath("$.error").value("Unauthorized"))
                .andExpect(jsonPath("$.message").value("Invalid email or password"));
    }

    @Test
    @DisplayName("POST /api/admin/login with non-existent email should return 401 Unauthorized")
    void nonExistentEmailReturns401() throws Exception {
        AdminLoginRequest request = new AdminLoginRequest("nonexistent@antigravity.com", "admin123");

        mockMvc.perform(post("/api/admin/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value(401))
                .andExpect(jsonPath("$.error").value("Unauthorized"))
                .andExpect(jsonPath("$.message").value("Invalid email or password"));
    }

    @Test
    @DisplayName("POST /api/admin/login with invalid email format should return 400 Bad Request")
    void invalidEmailFormatReturns400() throws Exception {
        AdminLoginRequest request = new AdminLoginRequest("invalid-email-format", "admin123");

        mockMvc.perform(post("/api/admin/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.error").value("Validation Failed"));
    }

    @Test
    @DisplayName("POST /api/admin/login with blank password should return 400 Bad Request")
    void blankPasswordReturns400() throws Exception {
        AdminLoginRequest request = new AdminLoginRequest("admin@antigravity.com", "");

        mockMvc.perform(post("/api/admin/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.error").value("Validation Failed"));
    }
}
