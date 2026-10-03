package com.zerowastemeals.backend.notification.websocket;

import com.zerowastemeals.backend.notification.dto.NotificationResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

/**
 * Pushes notification payloads to a single authenticated user over STOMP.
 *
 * <p>Destinations are user-scoped ({@code /user/queue/...}) so the broker routes each message only
 * to the sessions belonging to that principal — a user can never be handed another user's payload.
 */
@Component
public class NotificationPublisher {

    private static final Logger log = LoggerFactory.getLogger(NotificationPublisher.class);

    /** Client subscription destination, relative to the {@code /user} prefix. */
    public static final String USER_DESTINATION = "/queue/notifications";

    private final SimpMessagingTemplate messagingTemplate;

    public NotificationPublisher(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    /**
     * @param recipientEmail principal name of the recipient, i.e. the JWT subject (user email)
     */
    public void publishToUser(String recipientEmail, NotificationResponse payload) {
        if (recipientEmail == null || recipientEmail.isBlank()) {
            return;
        }
        try {
            messagingTemplate.convertAndSendToUser(recipientEmail, USER_DESTINATION, payload);
        } catch (RuntimeException ex) {
            // A failed push must never roll back the donation/claim that triggered it; the
            // notification stays persisted and the client picks it up on its next REST fetch.
            log.warn("Could not push notification to {}: {}", recipientEmail, ex.getMessage());
        }
    }
}
