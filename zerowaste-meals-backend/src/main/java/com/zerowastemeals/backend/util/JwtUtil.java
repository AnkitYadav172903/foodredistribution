package com.zerowastemeals.backend.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Date;

/**
 * Pure JWT helpers. Key material is provided by the caller (see JwtService).
 *
 * <p>The configured secret may be either base64-encoded (decoded to a key when
 * it is at least 32 bytes) or a plain string, in which case a 256-bit key is
 * derived from it via SHA-256 so that any value length is accepted.</p>
 */
public final class JwtUtil {

    private JwtUtil() {
    }

    public static SecretKey signingKey(String secret) {
        try {
            byte[] decoded = Decoders.BASE64.decode(secret);
            if (decoded.length >= 32) {
                return Keys.hmacShaKeyFor(decoded);
            }
        } catch (JwtException | IllegalArgumentException ignored) {
            // Not base64 - fall through to SHA-256 derivation.
        }
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256")
                    .digest(secret.getBytes(StandardCharsets.UTF_8));
            return Keys.hmacShaKeyFor(digest);
        } catch (NoSuchAlgorithmException ex) {
            throw new IllegalStateException("SHA-256 not available", ex);
        }
    }

    public static String generateToken(String subject, String role, String secret, long expirationMs) {
        Date now = new Date();
        return Jwts.builder()
                .subject(subject)
                .claim("role", role)
                .issuedAt(now)
                .expiration(new Date(now.getTime() + expirationMs))
                .signWith(signingKey(secret))
                .compact();
    }

    public static Claims parseToken(String token, String secret) {
        return Jwts.parser()
                .verifyWith(signingKey(secret))
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public static boolean isValid(String token, UserDetails userDetails, String secret) {
        Claims claims = parseToken(token, secret);
        String username = claims.getSubject();
        Date expiration = claims.getExpiration();
        return username != null
                && username.equals(userDetails.getUsername())
                && expiration != null
                && expiration.after(new Date());
    }
}