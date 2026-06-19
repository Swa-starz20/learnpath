package com.learnpath.security;

import com.learnpath.config.JwtProperties;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.stream.Collectors;

/**
 * JWT generation and validation service.
 *
 * <p>Uses HMAC-SHA256 (HS256) with a configurable secret key.
 * Access tokens embed userId, email, and roles as claims.
 *
 * <p>The secret key must be at least 256 bits (32 bytes).
 * Inject via {@code JWT_SECRET} environment variable — never hardcode.
 */
@Service
public class JwtService {

    private static final Logger log = LoggerFactory.getLogger(JwtService.class);

    private static final String CLAIM_ROLES = "roles";
    private static final String CLAIM_EMAIL = "email";

    private final JwtProperties jwtProperties;
    private final SecretKey signingKey;

    public JwtService(JwtProperties jwtProperties) {
        this.jwtProperties = jwtProperties;
        this.signingKey = Keys.hmacShaKeyFor(jwtProperties.getSecretBytes());
    }

    // ── Token Generation ──────────────────────────────────────────────────────

    /**
     * Generates a signed JWT access token for an authenticated user principal.
     *
     * @param principal the authenticated user
     * @return signed JWT string
     */
    public String generateToken(UserPrincipal principal) {
        String roles = principal.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(","));

        long nowMs = System.currentTimeMillis();
        long expiryMs = nowMs + jwtProperties.getAccessTokenTtlMs();

        return Jwts.builder()
                .subject(principal.getId().toString())
                .claim(CLAIM_EMAIL, principal.getUsername())
                .claim(CLAIM_ROLES, roles)
                .issuedAt(new Date(nowMs))
                .expiration(new Date(expiryMs))
                .signWith(signingKey)
                .compact();
    }

    // ── Token Validation ──────────────────────────────────────────────────────

    /**
     * Validates a JWT string. Returns {@code true} if the token is signed correctly
     * and has not expired.
     *
     * @param token the raw JWT string (without "Bearer " prefix)
     */
    public boolean isTokenValid(String token) {
        try {
            parseClaims(token);
            return true;
        } catch (ExpiredJwtException e) {
            log.debug("JWT expired: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            log.warn("JWT unsupported: {}", e.getMessage());
        } catch (MalformedJwtException e) {
            log.warn("JWT malformed: {}", e.getMessage());
        } catch (SecurityException e) {
            log.warn("JWT signature invalid: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            log.warn("JWT claims string is empty: {}", e.getMessage());
        }
        return false;
    }

    // ── Claims Extraction ─────────────────────────────────────────────────────

    /**
     * Extracts the subject claim (userId as string) from a valid token.
     */
    public String extractSubject(String token) {
        return parseClaims(token).getPayload().getSubject();
    }

    /**
     * Extracts the email claim from a valid token.
     */
    public String extractEmail(String token) {
        return parseClaims(token).getPayload().get(CLAIM_EMAIL, String.class);
    }

    // ── Private Helpers ───────────────────────────────────────────────────────

    private Jws<Claims> parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token);
    }
}
