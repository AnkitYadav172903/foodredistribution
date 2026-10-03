package com.zerowastemeals.backend.config;

import com.zerowastemeals.backend.entity.Role;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private static final Logger log = LoggerFactory.getLogger(SecurityConfig.class);

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final List<String> allowedOriginPatterns;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter,
            @Value("${app.cors.allowed-origins}") String allowedOrigins) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.allowedOriginPatterns = parseOrigins(allowedOrigins);

        if (this.allowedOriginPatterns.contains("*")) {
            log.warn("app.cors.allowed-origins is '*': every origin may call this API with credentials. "
                    + "Set CORS_ALLOWED_ORIGINS to your deployed frontend domain(s).");
        } else {
            log.info("CORS restricted to: {}", String.join(", ", this.allowedOriginPatterns));
        }
    }

    /**
     * Splits the configured comma-separated origins, falling back to the local Vite dev servers so
     * a missing value cannot silently widen access.
     */
    private static List<String> parseOrigins(String allowedOrigins) {
        List<String> origins = Arrays.stream(allowedOrigins.split(","))
                .map(String::trim)
                .filter(origin -> !origin.isEmpty())
                .toList();
        return origins.isEmpty()
                ? List.of("http://localhost:5173", "http://localhost:4173")
                : origins;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(exceptions -> exceptions
                        .authenticationEntryPoint((request, response, ex) ->
                                writeError(response, HttpServletResponse.SC_UNAUTHORIZED, "Authentication required"))
                        .accessDeniedHandler((request, response, ex) ->
                                writeError(response, HttpServletResponse.SC_FORBIDDEN, "You do not have permission")))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/register", "/api/auth/login", "/error").permitAll()
                        .requestMatchers(HttpMethod.GET, "/uploads/**").permitAll()
                        // The STOMP CONNECT frame carries the JWT, which WebSocketConfig validates;
                        // the handshake itself cannot be authenticated by the servlet filter chain.
                        .requestMatchers("/ws/**").permitAll()
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/uploads/**").authenticated()
                        .requestMatchers("/api/admin/**").hasRole(Role.ADMIN.name())
                        .requestMatchers(HttpMethod.POST, "/api/claims/*/confirm").hasAnyRole(Role.DONOR.name(), Role.ADMIN.name())
                        .requestMatchers(HttpMethod.POST, "/api/claims/*/reject").hasAnyRole(Role.DONOR.name(), Role.ADMIN.name())
                        .requestMatchers(HttpMethod.POST, "/api/listings/*/claim", "/api/claims/*/cancel", "/api/claims/*/start-pickup").hasRole(Role.NGO.name())
                        .requestMatchers(HttpMethod.POST, "/api/donations/**").hasAnyRole(Role.DONOR.name(), Role.ADMIN.name())
                        .requestMatchers(HttpMethod.PUT, "/api/donations/**").hasAnyRole(Role.DONOR.name(), Role.ADMIN.name())
                        .requestMatchers(HttpMethod.DELETE, "/api/donations/**").hasAnyRole(Role.DONOR.name(), Role.ADMIN.name())
                        .requestMatchers("/api/claims/**").authenticated()
                        .requestMatchers("/api/donations/**").authenticated()
                        .requestMatchers("/api/listings/**").authenticated()
                        .anyRequest().authenticated())
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(allowedOriginPatterns);
        // PATCH is required by the notification endpoints (mark-as-read, mark-all-read). It is not a
        // CORS-safelisted method, so leaving it out makes the browser preflight fail and the read
        // state silently never persists.
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    private static void writeError(HttpServletResponse response, int status, String message) throws IOException {
        response.setStatus(status);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.getWriter().write(String.format("{\"status\":%d,\"message\":\"%s\"}", status, message));
    }
}