package com.learnpath.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;
import org.springframework.validation.annotation.Validated;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import java.util.Base64;

/**
 * Typed configuration properties for JWT.
 *
 * <p>Bound from the {@code jwt.*} namespace in application.yml.
 * Secret is injected via the {@code JWT_SECRET} environment variable.
 */
@Component
@ConfigurationProperties(prefix = "jwt")
@Validated
public class JwtProperties {

    /**
     * HMAC-SHA256 signing secret — minimum 256 bits (32 characters).
     * Injected via environment variable {@code JWT_SECRET}.
     */
    @NotBlank(message = "JWT secret must not be blank")
    private String secret;

    /**
     * Access token time-to-live in minutes.
     * Default: 15 minutes.
     */
    @Min(value = 1, message = "JWT access token TTL must be at least 1 minute")
    private long accessTokenTtlMinutes = 15;

    // ── Derived ───────────────────────────────────────────────────────────────

    /** Returns the secret as a raw byte array for use with JJWT {@code Keys.hmacShaKeyFor()}. */
    public byte[] getSecretBytes() {
        // If the secret is Base64-encoded, decode it; otherwise use raw bytes.
        try {
            return Base64.getDecoder().decode(secret);
        } catch (IllegalArgumentException e) {
            return secret.getBytes(java.nio.charset.StandardCharsets.UTF_8);
        }
    }

    /** Returns access token TTL in milliseconds. */
    public long getAccessTokenTtlMs() {
        return accessTokenTtlMinutes * 60 * 1000L;
    }

    // ── Getters / Setters ─────────────────────────────────────────────────────

    public String getSecret() { return secret; }
    public void setSecret(String secret) { this.secret = secret; }
    public long getAccessTokenTtlMinutes() { return accessTokenTtlMinutes; }
    public void setAccessTokenTtlMinutes(long accessTokenTtlMinutes) {
        this.accessTokenTtlMinutes = accessTokenTtlMinutes;
    }
}
