package com.zerowastemeals.backend.notification.service;

import com.zerowastemeals.backend.exception.ResourceNotFoundException;
import com.zerowastemeals.backend.notification.dto.NotificationResponse;
import com.zerowastemeals.backend.notification.entity.Notification;
import com.zerowastemeals.backend.notification.entity.NotificationStatus;
import com.zerowastemeals.backend.notification.entity.NotificationType;
import com.zerowastemeals.backend.notification.repository.NotificationRepository;
import com.zerowastemeals.backend.notification.websocket.NotificationPublisher;
import com.zerowastemeals.backend.repository.UserRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Persists notifications and pushes them to the recipient's WebSocket queue.
 */
@Service
@Transactional(readOnly = true)
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final NotificationPublisher publisher;

    public NotificationService(NotificationRepository notificationRepository,
                               UserRepository userRepository,
                               NotificationPublisher publisher) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
        this.publisher = publisher;
    }

    /**
     * Saves a notification for {@code recipientId} and pushes it immediately.
     *
     * <p>Runs in its own transaction so a notification raised from inside a donation or claim
     * transaction is committed independently of it.
     */
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public NotificationResponse notify(Long recipientId,
                                       NotificationType type,
                                       String title,
                                       String message,
                                       Long donationId,
                                       String actionUrl) {
        if (recipientId == null) {
            return null;
        }

        Notification notification = new Notification();
        notification.setUserId(recipientId);
        notification.setDonationId(donationId);
        notification.setType(type == null ? NotificationType.SYSTEM_ALERT : type);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setActionUrl(actionUrl);
        notification.setStatus(NotificationStatus.UNREAD);

        Notification saved = notificationRepository.save(notification);
        NotificationResponse payload = NotificationResponse.from(saved);

        userRepository.findById(recipientId)
                .ifPresent(user -> publisher.publishToUser(user.getEmail(), payload));

        return payload;
    }

    public List<NotificationResponse> getForUser(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(NotificationResponse::from)
                .toList();
    }

    public List<NotificationResponse> getForUser(Long userId, int limit) {
        int safeLimit = Math.clamp(limit, 1, 200);
        return notificationRepository
                .findByUserIdOrderByCreatedAtDesc(userId, PageRequest.of(0, safeLimit))
                .stream()
                .map(NotificationResponse::from)
                .toList();
    }

    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndStatus(userId, NotificationStatus.UNREAD);
    }

    @Transactional
    public NotificationResponse markAsRead(Long userId, Long notificationId) {
        notificationRepository.findByIdAndUserId(notificationId, userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Notification not found with id: " + notificationId));
        notificationRepository.markAsRead(notificationId, userId);
        return notificationRepository.findByIdAndUserId(notificationId, userId)
                .map(NotificationResponse::from)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Notification not found with id: " + notificationId));
    }

    @Transactional
    public long markAllAsRead(Long userId) {
        return notificationRepository.markAllAsRead(userId);
    }

    @Transactional
    public void delete(Long userId, Long notificationId) {
        Notification notification = notificationRepository.findByIdAndUserId(notificationId, userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Notification not found with id: " + notificationId));
        notificationRepository.delete(notification);
    }
}
