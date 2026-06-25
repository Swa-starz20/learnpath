-- ============================================================
-- V17 — Notification Delivery Tracking
-- LearnPath Backend · Flyway Migration
-- ============================================================
-- Owner: notification module
-- Depends on: V16 (notifications table)
-- ============================================================

CREATE TABLE notification_delivery_log (
    id                UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    notification_id   UUID          NOT NULL REFERENCES notifications(id) ON DELETE CASCADE,
    delivery_channel  VARCHAR(50)   NOT NULL,
    delivery_status   VARCHAR(50)   NOT NULL,
    delivered_at      TIMESTAMPTZ,
    failure_reason    TEXT,
    created_at        TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ── Indexes ───────────────────────────────────────────────────
CREATE INDEX idx_delivery_log_notification ON notification_delivery_log(notification_id);
CREATE INDEX idx_delivery_log_status       ON notification_delivery_log(delivery_status);
CREATE INDEX idx_delivery_log_created_at   ON notification_delivery_log(created_at);
