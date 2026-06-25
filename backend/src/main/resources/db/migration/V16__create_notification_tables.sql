-- ============================================================
-- V16 — Notification Schema
-- LearnPath Backend · Flyway Migration
-- ============================================================
-- Owner: notification module
-- Depends on: V1 (users, set_updated_at function)
-- ============================================================

-- ── notifications ───────────────────────────────────────────
CREATE TABLE notifications (
    id                UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id           UUID          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    notification_type VARCHAR(50)   NOT NULL,
    title             VARCHAR(255)  NOT NULL,
    message           TEXT          NOT NULL,
    priority          VARCHAR(20)   NOT NULL DEFAULT 'MEDIUM',
    status            VARCHAR(20)   NOT NULL DEFAULT 'UNREAD',
    action_url        VARCHAR(255),
    created_at        TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    read_at           TIMESTAMPTZ
);

-- ── notification_preferences ─────────────────────────────────
CREATE TABLE notification_preferences (
    id                       UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                  UUID        NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    assessment_notifications BOOLEAN     NOT NULL DEFAULT TRUE,
    mentor_notifications     BOOLEAN     NOT NULL DEFAULT TRUE,
    placement_notifications  BOOLEAN     NOT NULL DEFAULT TRUE,
    analytics_notifications  BOOLEAN     NOT NULL DEFAULT TRUE,
    roadmap_notifications    BOOLEAN     NOT NULL DEFAULT TRUE,
    email_enabled            BOOLEAN     NOT NULL DEFAULT TRUE,
    in_app_enabled           BOOLEAN     NOT NULL DEFAULT TRUE,
    created_at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at               TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Indexes ───────────────────────────────────────────────────
CREATE INDEX idx_notifications_user       ON notifications(user_id);
CREATE INDEX idx_notifications_status     ON notifications(status);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);
CREATE INDEX idx_notifications_user_status ON notifications(user_id, status);

-- ── Triggers ──────────────────────────────────────────────────
CREATE TRIGGER trg_notification_preferences_updated_at
    BEFORE UPDATE ON notification_preferences
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
