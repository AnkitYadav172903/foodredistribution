package com.zerowastemeals.backend.config;

import com.zerowastemeals.backend.util.JwtUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
public class JwtService {

    private final String secret;
    private final long expirationMs;

    public JwtService(@Value("${jwt.secret}") String secret,
                      @Value("${jwt.expiration}") long expirationMs) {
        this.secret = secret;
        this.expirationMs = expirationMs;
    }

    public String generateToken(UserDetails userDetails) {
        String role = userDetails.getAuthorities().stream()
                .findFirst()
                .map(authority -> authority.getAuthority())
                .orElse("");
        return JwtUtil.generateToken(userDetails.getUsername(), role, secret, expirationMs);
    }

    public String extractUsername(String token) {
        return JwtUtil.parseToken(token, secret).getSubject();
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        return JwtUtil.isValid(token, userDetails, secret);
    }
}