package com.zerowastemeals.backend.notification.dto;

import com.zerowastemeals.backend.notification.entity.NotificationType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * Payload used to raise a notification for a recipient. {@code userId} is intentionally omitted:
 * recipients are always derived server-side from the acting user or the donation being acted on,
 * so a caller can never address a notification to somebody else.
 */
public record NotificationRequest(
        @NotNull(message = "Notification type is required") NotificationType type,
        @NotBlank(message = "Title is required") @Size(max = 160, message = "Title must not exceed 160 characters") String title,
        @NotBlank(message = "Message is required") @Size(max = 1000, message = "Message must not exceed 1000 characters") String message,
        @Size(max = 512, message = "Action URL must not exceed 512 characters") String actionUrl
) {
}
