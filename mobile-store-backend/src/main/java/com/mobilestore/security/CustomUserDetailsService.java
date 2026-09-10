package com.mobilestore.security;

import com.mobilestore.admin.entity.Admin;
import com.mobilestore.admin.repository.AdminRepository;
import com.mobilestore.user.entity.User;
import com.mobilestore.user.repository.UserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Optional;

/**
 * CustomUserDetailsService
 * Module: security
 * Loads user details for Spring Security authentication from both AdminRepository and UserRepository.
 * Enables unified JWT validation and distinct role-based security context populations:
 * - Admin credentials resolve to ROLE_ADMIN
 * - Customer credentials resolve to ROLE_USER (with enabled status enforcement)
 */
@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final AdminRepository adminRepository;
    private final UserRepository userRepository;

    public CustomUserDetailsService(AdminRepository adminRepository, UserRepository userRepository) {
        this.adminRepository = adminRepository;
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // 1. Check Admin repository first
        Optional<Admin> adminOpt = adminRepository.findByEmailIgnoreCase(email);
        if (adminOpt.isPresent()) {
            Admin admin = adminOpt.get();
            return new org.springframework.security.core.userdetails.User(
                    admin.getEmail(),
                    admin.getPassword(),
                    Collections.singletonList(new SimpleGrantedAuthority(SecurityConstants.ROLE_ADMIN))
            );
        }

        // 2. Check Customer/User repository
        Optional<User> userOpt = userRepository.findByEmailIgnoreCase(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            return new org.springframework.security.core.userdetails.User(
                    user.getEmail(),
                    user.getPassword(),
                    user.isEnabled(),
                    true, // accountNonExpired
                    true, // credentialsNonExpired
                    true, // accountNonLocked
                    Collections.singletonList(new SimpleGrantedAuthority(user.getRole().name()))
            );
        }

        throw new UsernameNotFoundException("Account not found with email: " + email);
    }
}
