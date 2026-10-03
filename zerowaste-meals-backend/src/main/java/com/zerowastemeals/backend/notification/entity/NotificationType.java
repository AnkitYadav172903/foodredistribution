package com.zerowastemeals.backend.notification.entity;

/**
 * Category of an in-app notification. Drives the icon and accent colour used by the client.
 */
public enum NotificationType {
    NEW_DONATION,
    DONATION_ACCEPTED,
    PICKUP_STARTED,
    PICKUP_COMPLETED,
    SYSTEM_ALERT
}
