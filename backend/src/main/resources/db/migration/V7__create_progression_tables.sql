-- ============================================================
-- V7 — Progression Tables
-- LearnPath Backend · Flyway Migration
-- ============================================================
-- Owner: progression module
-- Depends on: V1 (users table, set_updated_at function)
-- mastery_score is authoritative ONLY in this table (approved architecture)
-- ============================================================

-- ── user_progression ─────────────────────────────────────────
CREATE TABLE user_progression (
    id               BIGSERIAL    PRIMARY KEY,
    user_id          UUID         NOT NULL UNIQUE,
    total_xp         INTEGER      NOT NULL DEFAULT 0,
    mastery_score    NUMERIC(5,2) NOT NULL DEFAULT 0.00,
    streak_days      INTEGER      NOT NULL DEFAULT 0,
    last_activity_at TIMESTAMPTZ,
    created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_mastery_score CHECK (mastery_score >= 0 AND mastery_score <= 100),
    CONSTRAINT chk_total_xp      CHECK (total_xp >= 0),
    CONSTRAINT chk_streak_days   CHECK (streak_days >= 0)
);

CREATE INDEX idx_user_progression_user ON user_progression(user_id);

-- ── Updated-at trigger ────────────────────────────────────────
CREATE TRIGGER trg_user_progression_updated_at
    BEFORE UPDATE ON user_progression
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
