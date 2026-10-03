package com.zerowastemeals.backend.config;

import com.zerowastemeals.backend.util.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
public class JwtService {

    private static final Logger log = LoggerFactory.getLogger(JwtService.class);

    /**
     * The value that used to ship as the built-in default in application.properties. It is in this
     * public repository, so anyone could mint a valid token for any account with it. It is no longer
     * a default anywhere; this constant only guards against it being reintroduced as one.
     */
    private static final String INSECURE_DEFAULT_SECRET = "zerowaste_meals_super_secret_key_2026";

    private final String secret;
    private final long expirationMs;

    public JwtService(@Value("${jwt.secret}") String secret,
                      @Value("${jwt.expiration}") long expirationMs,
                      @Value("${app.security.allow-insecure-default-jwt-secret:false}") boolean allowInsecureDefaultSecret) {
        this.secret = secret;
        this.expirationMs = expirationMs;
        validateSecret(secret, allowInsecureDefaultSecret);
    }

    private static void validateSecret(String secret, boolean allowInsecureDefaultSecret) {
        if (secret == null || secret.isBlank()) {
            throw new IllegalStateException(
                    "JWT secret is not configured, so the app refuses to start. Set the JWT_SECRET "
                            + "environment variable to a strong random value and redeploy "
                            + "(for example: openssl rand -hex 32).");
        }
        if (!INSECURE_DEFAULT_SECRET.equals(secret)) {
            return;
        }
        if (allowInsecureDefaultSecret) {
            log.warn("Running with the well-known default JWT secret. Set JWT_SECRET before deploying.");
            return;
        }
        throw new IllegalStateException(
                "JWT_SECRET is set to a known public value, which would let anyone forge a token for any "
                        + "account. Set the JWT_SECRET environment variable to a strong random value and "
                        + "redeploy. To run against this value on purpose, set "
                        + "ALLOW_INSECURE_DEFAULT_JWT_SECRET=true.");
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