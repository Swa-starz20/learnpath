-- ============================================================
-- V15 — Analytics Intelligence Schema
-- LearnPath Backend · Flyway Migration
-- ============================================================
-- Owner: analytics module
-- Depends on: V14 (analytics_snapshots), V8 (assessment_results), V1 (users)
-- ============================================================

-- ── analytics_insights ──────────────────────────────────────
CREATE TABLE analytics_insights (
    id                   UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id              UUID           NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    insight_type         VARCHAR(50)    NOT NULL,
    title                VARCHAR(255)   NOT NULL,
    description          TEXT           NOT NULL,
    priority             VARCHAR(20)    NOT NULL,
    generated_at         TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    assessment_result_id UUID           REFERENCES assessment_results(id) ON DELETE SET NULL,
    snapshot_id          UUID           REFERENCES analytics_snapshots(id) ON DELETE SET NULL
);

-- ── analytics_recommendations ─────────────────────────────────
CREATE TABLE analytics_recommendations (
    id                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID            NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    recommendation_type VARCHAR(50)     NOT NULL,
    title               VARCHAR(255)    NOT NULL,
    description         TEXT            NOT NULL,
    action_url          VARCHAR(255),
    completed           BOOLEAN         NOT NULL DEFAULT FALSE,
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- Partial unique index to prevent duplicate active recommendations per user
CREATE UNIQUE INDEX uq_active_analytics_rec ON analytics_recommendations(user_id, recommendation_type, title) WHERE (completed = false);

-- ── analytics_trends ─────────────────────────────────────────
CREATE TABLE analytics_trends (
    id                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID            NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    metric_name         VARCHAR(50)     NOT NULL,
    previous_value      DECIMAL(5,2)    NOT NULL,
    current_value       DECIMAL(5,2)    NOT NULL,
    trend_direction     VARCHAR(20)     NOT NULL,
    improvement_percent DECIMAL(5,2)    NOT NULL,
    calculated_at       TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- ── analytics_predictions ────────────────────────────────────
CREATE TABLE analytics_predictions (
    id                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID            NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    prediction_type     VARCHAR(50)     NOT NULL,
    predicted_score     DECIMAL(10,2)   NOT NULL,
    confidence          VARCHAR(20)     NOT NULL,
    explanation         TEXT            NOT NULL,
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- ── Indexes ───────────────────────────────────────────────────
CREATE INDEX idx_analytics_insights_user ON analytics_insights(user_id);
CREATE INDEX idx_analytics_insights_result ON analytics_insights(assessment_result_id);
CREATE INDEX idx_analytics_insights_snapshot ON analytics_insights(snapshot_id);
CREATE INDEX idx_analytics_recs_user ON analytics_recommendations(user_id);
CREATE INDEX idx_analytics_trends_user ON analytics_trends(user_id);
CREATE INDEX idx_analytics_predictions_user ON analytics_predictions(user_id);

-- ── Triggers ──────────────────────────────────────────────────
CREATE TRIGGER trg_analytics_recs_updated_at
    BEFORE UPDATE ON analytics_recommendations
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
