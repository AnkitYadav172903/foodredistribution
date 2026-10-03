-- ZeroWaste Meals — notifications table
--
-- Creates the in-app notification log used by the real-time notification system.
-- Existing tables (users, donations, claims) are not touched.
--
-- The running application uses spring.jpa.hibernate.ddl-auto=update, so Hibernate creates an
-- equivalent table automatically on first start. Run this script manually only if the database is
-- managed outside of the application (e.g. a Neon branch that is schema-pinned).
--
-- Id types deliberately match the existing schema: users.id and donations.id are BIGINT
-- identity columns, so notification.user_id / donation_id are BIGINT as well. They are plain
-- columns rather than foreign keys so a notification log survives removal of a user or listing.

CREATE TABLE IF NOT EXISTS notifications (
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT       NOT NULL,
    donation_id BIGINT       NULL,
    title       VARCHAR(160) NOT NULL,
    message     VARCHAR(1000) NOT NULL,
    type        VARCHAR(40)  NOT NULL,
    status      VARCHAR(20)  NOT NULL DEFAULT 'UNREAD',
    action_url  VARCHAR(512) NULL,
    created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Serves the notification history list (newest first) for one user.
CREATE INDEX IF NOT EXISTS idx_notifications_user_created
    ON notifications (user_id, created_at DESC);

-- Serves the unread badge counter.
CREATE INDEX IF NOT EXISTS idx_notifications_user_status
    ON notifications (user_id, status);

-- Guard rails matching the JPA mapping.
ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_type_check;
ALTER TABLE notifications
    ADD CONSTRAINT notifications_type_check
    CHECK (type IN ('NEW_DONATION', 'DONATION_ACCEPTED', 'PICKUP_STARTED', 'PICKUP_COMPLETED', 'SYSTEM_ALERT'));

ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_status_check;
ALTER TABLE notifications
    ADD CONSTRAINT notifications_status_check
    CHECK (status IN ('UNREAD', 'READ'));
