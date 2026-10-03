package com.zerowastemeals.backend.notification.repository;

import com.zerowastemeals.backend.notification.entity.Notification;
import com.zerowastemeals.backend.notification.entity.NotificationStatus;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<Notification> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    long countByUserIdAndStatus(Long userId, NotificationStatus status);

    Optional<Notification> findByIdAndUserId(Long id, Long userId);

    /**
     * Flips a single notification to READ, scoped to its owner so one user can never mutate
     * another user's notification. Returns the number of rows affected.
     */
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("""
            update Notification n
               set n.status = com.zerowastemeals.backend.notification.entity.NotificationStatus.READ,
                   n.updatedAt = CURRENT_TIMESTAMP
             where n.id = :id
               and n.userId = :userId
            """)
    int markAsRead(@Param("id") Long id, @Param("userId") Long userId);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("""
            update Notification n
               set n.status = com.zerowastemeals.backend.notification.entity.NotificationStatus.READ,
                   n.updatedAt = CURRENT_TIMESTAMP
             where n.userId = :userId
               and n.status = com.zerowastemeals.backend.notification.entity.NotificationStatus.UNREAD
            """)
    int markAllAsRead(@Param("userId") Long userId);
}
