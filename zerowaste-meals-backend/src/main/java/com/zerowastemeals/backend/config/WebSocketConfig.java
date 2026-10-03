package com.zerowastemeals.backend.config;

import com.zerowastemeals.backend.security.CustomUserDetailsService;
import com.zerowastemeals.backend.util.Constants;
import io.jsonwebtoken.JwtException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import java.util.List;

/**
 * STOMP over WebSocket configuration for real-time notifications.
 *
 * <p>The browser cannot attach an {@code Authorization} header to a WebSocket handshake, so the
 * JWT travels in the STOMP {@code CONNECT} frame instead and is validated by
 * {@link #configureClientInboundChannel}. Only authenticated sessions receive a principal, and the
 * user destination prefix is what scopes deliveries to a single account.
 */
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;
    private final List<String> allowedOriginPatterns;

    public WebSocketConfig(JwtService jwtService,
                           CustomUserDetailsService userDetailsService,
                           @Value("${app.websocket.allowed-origins:*}") String allowedOrigins) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
        this.allowedOriginPatterns = List.of(allowedOrigins.split(","));
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        String[] origins = allowedOriginPatterns.stream()
                .map(String::trim)
                .filter(origin -> !origin.isEmpty())
                .toArray(String[]::new);

        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns(origins.length == 0 ? new String[]{"*"} : origins)
                .withSockJS();
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.enableSimpleBroker("/topic");
        registry.setApplicationDestinationPrefixes("/app");
        registry.setUserDestinationPrefix("/user");
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(new JwtHandshakeInterceptor());
    }

    /**
     * Authenticates the STOMP {@code CONNECT} frame and binds the resulting principal to the
     * session, which is what {@code convertAndSendToUser} resolves destinations against.
     */
    private final class JwtHandshakeInterceptor implements ChannelInterceptor {

        @Override
        public Message<?> preSend(Message<?> message, MessageChannel channel) {
            StompHeaderAccessor accessor =
                    MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
            if (accessor == null || !StompCommand.CONNECT.equals(accessor.getCommand())) {
                return message;
            }

            String header = accessor.getFirstNativeHeader(Constants.AUTHORIZATION_HEADER);
            if (header == null || !header.startsWith(Constants.BEARER_PREFIX)) {
                throw new org.springframework.security.authentication.BadCredentialsException(
                        "Missing bearer token");
            }

            String token = header.substring(Constants.BEARER_PREFIX.length()).trim();
            try {
                String username = jwtService.extractUsername(token);
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                if (!jwtService.isTokenValid(token, userDetails)) {
                    throw new org.springframework.security.authentication.BadCredentialsException(
                            "Invalid token");
                }
                accessor.setUser(new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities()));
            } catch (JwtException | IllegalArgumentException ex) {
                throw new org.springframework.security.authentication.BadCredentialsException(
                        "Invalid token", ex);
            }

            return message;
        }
    }
}
