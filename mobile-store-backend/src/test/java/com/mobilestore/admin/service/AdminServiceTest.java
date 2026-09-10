package com.mobilestore.admin.service;

import com.mobilestore.admin.dto.AdminLoginRequest;
import com.mobilestore.admin.dto.AdminLoginResponse;
import com.mobilestore.admin.dto.AdminResponse;
import com.mobilestore.admin.entity.Admin;
import com.mobilestore.admin.repository.AdminRepository;
import com.mobilestore.admin.service.impl.AdminServiceImpl;
import com.mobilestore.exception.ResourceNotFoundException;
import com.mobilestore.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdminServiceTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtService jwtService;

    @Mock
    private AdminRepository adminRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AdminServiceImpl adminService;

    private Admin sampleAdmin;

    @BeforeEach
    void setUp() {
        sampleAdmin = Admin.builder()
                .id(UUID.fromString("e1a11111-1111-1111-1111-111111111111"))
                .name("Super Admin")
                .email("admin@antigravity.com")
                .password("$2a$10$OVyzRZYjiTkubTorTUbde.lOP9Uf1k7CFjlqi6Ht2QGHFvBT.JN..")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    @Test
    @DisplayName("Should successfully authenticate admin and return JWT response")
    void shouldLoginSuccessfully() {
        AdminLoginRequest request = new AdminLoginRequest("admin@antigravity.com", "admin123");
        Authentication authMock = mock(Authentication.class);
        String mockToken = "mock.jwt.token.for.admin";
        Date futureDate = new Date(System.currentTimeMillis() + 86400000);

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authMock);
        when(adminRepository.findByEmailIgnoreCase("admin@antigravity.com"))
                .thenReturn(Optional.of(sampleAdmin));
        when(jwtService.generateToken("admin@antigravity.com"))
                .thenReturn(mockToken);
        when(jwtService.extractExpiration(mockToken))
                .thenReturn(futureDate);

        AdminLoginResponse response = adminService.login(request);

        assertNotNull(response);
        assertEquals(mockToken, response.getToken());
        assertEquals("Bearer", response.getTokenType());
        assertEquals("Super Admin", response.getAdminName());
        assertEquals("admin@antigravity.com", response.getEmail());
        assertNotNull(response.getExpiresAt());

        verify(authenticationManager, times(1)).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(jwtService, times(1)).generateToken("admin@antigravity.com");
    }

    @Test
    @DisplayName("Should throw BadCredentialsException when password does not match")
    void shouldThrowWhenPasswordInvalid() {
        AdminLoginRequest request = new AdminLoginRequest("admin@antigravity.com", "wrongPassword");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Bad credentials"));

        BadCredentialsException ex = assertThrows(BadCredentialsException.class, () ->
                adminService.login(request)
        );
        assertEquals("Invalid email or password", ex.getMessage());

        verify(jwtService, never()).generateToken(anyString());
    }

    @Test
    @DisplayName("Should throw BadCredentialsException when email is not found")
    void shouldThrowWhenEmailNotFound() {
        AdminLoginRequest request = new AdminLoginRequest("unknown@antigravity.com", "admin123");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Bad credentials"));

        BadCredentialsException ex = assertThrows(BadCredentialsException.class, () ->
                adminService.login(request)
        );
        assertEquals("Invalid email or password", ex.getMessage());

        verify(jwtService, never()).generateToken(anyString());
    }

    @Test
    @DisplayName("Should find admin profile by email successfully")
    void shouldFindByEmail() {
        when(adminRepository.findByEmailIgnoreCase("admin@antigravity.com"))
                .thenReturn(Optional.of(sampleAdmin));

        AdminResponse response = adminService.findByEmail("admin@antigravity.com");

        assertNotNull(response);
        assertEquals(sampleAdmin.getId(), response.getId());
        assertEquals(sampleAdmin.getName(), response.getName());
        assertEquals(sampleAdmin.getEmail(), response.getEmail());
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when findByEmail does not exist")
    void shouldThrowWhenFindByEmailNotFound() {
        when(adminRepository.findByEmailIgnoreCase("missing@antigravity.com"))
                .thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () ->
                adminService.findByEmail("missing@antigravity.com")
        );
    }

    @Test
    @DisplayName("Should return existence flag correctly")
    void shouldCheckExistsByEmail() {
        when(adminRepository.existsByEmailIgnoreCase("admin@antigravity.com")).thenReturn(true);
        when(adminRepository.existsByEmailIgnoreCase("other@antigravity.com")).thenReturn(false);

        assertTrue(adminService.existsByEmail("admin@antigravity.com"));
        assertFalse(adminService.existsByEmail("other@antigravity.com"));
    }
}
