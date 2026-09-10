package com.mobilestore.security;

import com.mobilestore.admin.entity.Admin;
import com.mobilestore.admin.repository.AdminRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import com.mobilestore.user.repository.UserRepository;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CustomUserDetailsServiceTest {

    @Mock
    private AdminRepository adminRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private CustomUserDetailsService customUserDetailsService;

    private Admin sampleAdmin;

    @BeforeEach
    void setUp() {
        sampleAdmin = Admin.builder()
                .id(UUID.randomUUID())
                .name("Super Admin")
                .email("admin@antigravity.com")
                .password("$2a$10$OVyzRZYjiTkubTorTUbde.lOP9Uf1k7CFjlqi6Ht2QGHFvBT.JN..")
                .build();
    }

    @Test
    @DisplayName("Should successfully load admin user by email with ROLE_ADMIN")
    void shouldLoadUserByEmailSuccessfully() {
        when(adminRepository.findByEmailIgnoreCase("admin@antigravity.com"))
                .thenReturn(Optional.of(sampleAdmin));

        UserDetails userDetails = customUserDetailsService.loadUserByUsername("admin@antigravity.com");

        assertNotNull(userDetails);
        assertEquals("admin@antigravity.com", userDetails.getUsername());
        assertEquals(sampleAdmin.getPassword(), userDetails.getPassword());
        assertTrue(userDetails.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN")));
        verify(adminRepository, times(1)).findByEmailIgnoreCase("admin@antigravity.com");
    }

    @Test
    @DisplayName("Should throw UsernameNotFoundException when admin is not found")
    void shouldThrowWhenAdminNotFound() {
        when(adminRepository.findByEmailIgnoreCase(anyString()))
                .thenReturn(Optional.empty());
        when(userRepository.findByEmailIgnoreCase(anyString()))
                .thenReturn(Optional.empty());

        assertThrows(UsernameNotFoundException.class, () ->
                customUserDetailsService.loadUserByUsername("unknown@antigravity.com")
        );
        verify(adminRepository, times(1)).findByEmailIgnoreCase("unknown@antigravity.com");
        verify(userRepository, times(1)).findByEmailIgnoreCase("unknown@antigravity.com");
    }
}
