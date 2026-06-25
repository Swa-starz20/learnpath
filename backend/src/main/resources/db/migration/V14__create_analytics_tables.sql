-- ============================================================
-- V14 — Analytics Schema
-- LearnPath Backend · Flyway Migration
-- ============================================================
-- Owner: analytics module
-- Depends on: V1 (users, set_updated_at function)
-- ============================================================

-- ── analytics_snapshots ──────────────────────────────────────
CREATE TABLE analytics_snapshots (
    id                 UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id            UUID           NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    overall_progress   DECIMAL(5,2)   NOT NULL DEFAULT 0.00,
    roadmap_completion DECIMAL(5,2)   NOT NULL DEFAULT 0.00,
    assessment_average DECIMAL(5,2)   NOT NULL DEFAULT 0.00,
    readiness_score    DECIMAL(5,2)   NOT NULL DEFAULT 0.00,
    total_xp           INTEGER        NOT NULL DEFAULT 0,
    mastery_score      DECIMAL(5,2)   NOT NULL DEFAULT 0.00,
    snapshot_time      TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    created_at         TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    updated_at         TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

-- ── analytics_activity_logs ──────────────────────────────────
CREATE TABLE analytics_activity_logs (
    id            UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id       UUID          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    activity_type VARCHAR(50)   NOT NULL,
    reference_id  VARCHAR(255),
    metadata      JSONB,
    created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ── analytics_learning_streaks ───────────────────────────────
CREATE TABLE analytics_learning_streaks (
    id                 UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id            UUID         NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    current_streak     INTEGER      NOT NULL DEFAULT 0,
    longest_streak     INTEGER      NOT NULL DEFAULT 0,
    last_activity_date DATE         NOT NULL,
    created_at         TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at         TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ── Indexes ───────────────────────────────────────────────────
CREATE INDEX idx_analytics_snapshots_user ON analytics_snapshots(user_id);
CREATE INDEX idx_analytics_snapshots_time ON analytics_snapshots(snapshot_time);
CREATE INDEX idx_analytics_activity_logs_user ON analytics_activity_logs(user_id);
CREATE INDEX idx_analytics_activity_logs_type ON analytics_activity_logs(activity_type);
CREATE INDEX idx_analytics_streaks_user ON analytics_learning_streaks(user_id);

-- ── Triggers ──────────────────────────────────────────────────
CREATE TRIGGER trg_analytics_snapshots_updated_at
    BEFORE UPDATE ON analytics_snapshots
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_analytics_streaks_updated_at
    BEFORE UPDATE ON analytics_learning_streaks
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
