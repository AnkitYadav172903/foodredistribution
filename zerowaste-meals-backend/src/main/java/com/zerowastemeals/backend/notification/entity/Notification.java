package com.zerowastemeals.backend.notification.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

/**
 * A persisted in-app notification for a single recipient.
 *
 * <p>Recipient and donation are stored as plain {@code Long} columns rather than associations so a
 * notification log survives removal of the referenced user or listing. The types match the
 * existing {@code users.id} / {@code donations.id} primary keys.
 */
@Entity
@Table(
        name = "notifications",
        indexes = {
                @Index(name = "idx_notifications_user_created", columnList = "user_id, created_at"),
                @Index(name = "idx_notifications_user_status", columnList = "user_id, status")
        })
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "donation_id")
    private Long donationId;

    @Column(nullable = false, length = 160)
    private String title;

    @Column(nullable = false, length = 1000)
    private String message;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 40)
    private NotificationType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private NotificationStatus status;

    @Column(name = "action_url", length = 512)
    private String actionUrl;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        if (this.createdAt == null) {
            this.createdAt = now;
        }
        this.updatedAt = now;
        if (this.status == null) {
            this.status = NotificationStatus.UNREAD;
        }
        if (this.type == null) {
            this.type = NotificationType.SYSTEM_ALERT;
        }
    }

    @PreUpdate
    void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }

    public void setUserId(Long userId) { this.userId = userId; }

    public Long getDonationId() { return donationId; }

    public void setDonationId(Long donationId) { this.donationId = donationId; }

    public String getTitle() { return title; }

    public void setTitle(String title) { this.title = title; }

    public String getMessage() { return message; }

    public void setMessage(String message) { this.message = message; }

    public NotificationType getType() { return type; }

    public void setType(NotificationType type) { this.type = type; }

    public NotificationStatus getStatus() { return status; }

    public void setStatus(NotificationStatus status) { this.status = status; }

    public String getActionUrl() { return actionUrl; }

    public void setActionUrl(String actionUrl) { this.actionUrl = actionUrl; }

    public LocalDateTime getCreatedAt() { return createdAt; }

    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }

    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
