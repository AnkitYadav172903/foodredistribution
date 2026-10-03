package com.zerowastemeals.backend.notification.controller;

import com.zerowastemeals.backend.notification.dto.NotificationResponse;
import com.zerowastemeals.backend.notification.service.NotificationService;
import com.zerowastemeals.backend.security.UserPrincipal;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

/**
 * Notification history for the authenticated user.
 *
 * <p>Every endpoint derives the user id from the JWT, so one account can only ever read or mutate
 * its own notifications — there is no request parameter that could target another user.
 */
@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    public List<NotificationResponse> list(@RequestParam(required = false) Integer limit,
                                           Authentication authentication) {
        Long userId = currentUserId(authentication);
        return limit == null
                ? notificationService.getForUser(userId)
                : notificationService.getForUser(userId, limit);
    }

    @GetMapping("/unread-count")
    public Map<String, Object> unreadCount(Authentication authentication) {
        return Map.of("unreadCount", notificationService.getUnreadCount(currentUserId(authentication)));
    }

    @PatchMapping("/read/{id}")
    public NotificationResponse markRead(@PathVariable Long id, Authentication authentication) {
        return notificationService.markAsRead(currentUserId(authentication), id);
    }

    @PatchMapping("/read-all")
    public Map<String, Object> markAllRead(Authentication authentication) {
        long updated = notificationService.markAllAsRead(currentUserId(authentication));
        return Map.of("updated", updated, "unreadCount", 0L);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id, Authentication authentication) {
        notificationService.delete(currentUserId(authentication), id);
    }

    private Long currentUserId(Authentication authentication) {
        return ((UserPrincipal) authentication.getPrincipal()).getId();
    }
}
