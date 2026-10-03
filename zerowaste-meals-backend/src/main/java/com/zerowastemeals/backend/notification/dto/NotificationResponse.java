package com.zerowastemeals.backend.notification.dto;

import com.zerowastemeals.backend.notification.entity.Notification;
import com.zerowastemeals.backend.notification.entity.NotificationStatus;
import com.zerowastemeals.backend.notification.entity.NotificationType;

import java.time.LocalDateTime;

public record NotificationResponse(
        Long id,
        Long userId,
        Long donationId,
        String title,
        String message,
        NotificationType type,
        NotificationStatus status,
        String actionUrl,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {

    public static NotificationResponse from(Notification notification) {
        return new NotificationResponse(
                notification.getId(),
                notification.getUserId(),
                notification.getDonationId(),
                notification.getTitle(),
                notification.getMessage(),
                notification.getType(),
                notification.getStatus(),
                notification.getActionUrl(),
                notification.getCreatedAt(),
                notification.getUpdatedAt()
        );
    }
}
