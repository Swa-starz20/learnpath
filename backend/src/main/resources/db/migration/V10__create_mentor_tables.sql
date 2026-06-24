-- ============================================================
-- V10 — Mentor Schema
-- LearnPath Backend · Flyway Migration
-- ============================================================
-- Owner: mentor module
-- Depends on: V1 (users, set_updated_at), V3 (domains)
-- ============================================================

-- ── mentor_profiles ──────────────────────────────────────────
CREATE TABLE mentor_profiles (
    id                 UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id            UUID         NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    primary_domain_id  BIGINT       REFERENCES domains(id) ON DELETE SET NULL,
    current_level      VARCHAR(50),
    target_role        VARCHAR(200),
    created_at         TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at         TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ── mentor_insights ──────────────────────────────────────────
CREATE TABLE mentor_insights (
    id                 UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id            UUID         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    insight_type       VARCHAR(100) NOT NULL,
    title              VARCHAR(255) NOT NULL,
    description        TEXT         NOT NULL,
    priority           INTEGER      NOT NULL DEFAULT 1,
    generated_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ── mentor_recommendations ────────────────────────────────────
CREATE TABLE mentor_recommendations (
    id                  UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    recommendation_type VARCHAR(100) NOT NULL,
    title               VARCHAR(255) NOT NULL,
    description         TEXT         NOT NULL,
    action_url          VARCHAR(500),
    is_completed        BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ── Indexes ───────────────────────────────────────────────────
CREATE INDEX idx_mentor_profiles_user             ON mentor_profiles(user_id);
CREATE INDEX idx_mentor_profiles_domain           ON mentor_profiles(primary_domain_id);
CREATE INDEX idx_mentor_insights_user             ON mentor_insights(user_id);
CREATE INDEX idx_mentor_recommendations_user      ON mentor_recommendations(user_id);
CREATE INDEX idx_mentor_recommendations_completed ON mentor_recommendations(is_completed);

-- ── Trigger for mentor_profiles ──────────────────────────────
CREATE TRIGGER trg_mentor_profiles_updated_at
    BEFORE UPDATE ON mentor_profiles
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
