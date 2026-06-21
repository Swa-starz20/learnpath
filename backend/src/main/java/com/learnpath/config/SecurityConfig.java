package com.learnpath.config;

import com.learnpath.security.AuthEntryPoint;
import com.learnpath.security.CustomUserDetailsService;
import com.learnpath.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

/**
 * Spring Security configuration for LearnPath backend.
 *
 * <p>Stateless JWT-based authentication. No sessions, no CSRF (SPA).
 * Public endpoints: auth registration, login, actuator health.
 * All other endpoints require a valid Bearer token.
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final CustomUserDetailsService userDetailsService;
    private final AuthEntryPoint authEntryPoint;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter,
                          CustomUserDetailsService userDetailsService,
                          AuthEntryPoint authEntryPoint) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.userDetailsService = userDetailsService;
        this.authEntryPoint = authEntryPoint;
    }

    // ── Security Filter Chain ─────────────────────────────────────────────────

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                // Disable CSRF — stateless JWT API does not need it
                .csrf(AbstractHttpConfigurer::disable)

                // CORS — configured below
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // Stateless session — no HttpSession created
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // Unauthorized access → JSON 401 (not HTML redirect)
                .exceptionHandling(ex ->
                        ex.authenticationEntryPoint(authEntryPoint))

                // Authorization rules
                .authorizeHttpRequests(auth -> auth
                        // Explicit public auth endpoints (register + login only)
                        .requestMatchers("/api/v1/auth/register").permitAll()
                        .requestMatchers("/api/v1/auth/login").permitAll()
                        // Phase 2 — public catalog read endpoints (no auth required)
                        .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/v1/domains/**").permitAll()
                        .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/v1/courses/**").permitAll()
                        .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/v1/roadmaps/**").permitAll()
                        .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/v1/skills").permitAll()
                        .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/v1/skills/{id}").permitAll()
                        // Phase 3A — public assessment template catalog (no auth required)
                        .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/v1/assessments/templates").permitAll()
                        .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/v1/assessments/templates/{id}").permitAll()
                        // Public health check
                        .requestMatchers("/actuator/health").permitAll()
                        // Swagger/OpenAPI (for development)
                        .requestMatchers("/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
                        // Admin-only endpoints
                        .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")
                        // All other endpoints (including /auth/me, user mutations, progression) require authentication
                        .anyRequest().authenticated()
                )

                // Wire in JWT filter before Spring's username/password filter
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)

                .build();
    }

    // ── Authentication Provider ───────────────────────────────────────────────

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    // ── Password Encoding ─────────────────────────────────────────────────────

    /**
     * BCrypt with strength 12 — industry standard for password hashing.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    // ── CORS ──────────────────────────────────────────────────────────────────

    /**
     * CORS configuration for SPA frontend.
     * Allowed origins are controlled via the {@code CORS_ALLOWED_ORIGINS} env var
     * and injected in application.yml.
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(List.of("*")); // Overridden per-profile
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type", "Accept"));
        config.setExposedHeaders(List.of("Authorization"));
        config.setAllowCredentials(false); // Must be false with allowedOriginPatterns("*")
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", config);
        return source;
    }
}
