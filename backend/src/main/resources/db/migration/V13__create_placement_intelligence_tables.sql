-- ============================================================
-- V13 — Placement Intelligence Schema
-- LearnPath Backend · Flyway Migration
-- ============================================================
-- Owner: placement module
-- Depends on: V12 (placement_profiles), V8 (assessment_results), V4 (skills)
-- ============================================================

-- ── placement_readiness ──────────────────────────────────────
CREATE TABLE placement_readiness (
    id                   UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id           UUID           NOT NULL REFERENCES placement_profiles(id) ON DELETE CASCADE,
    assessment_result_id UUID           NOT NULL UNIQUE REFERENCES assessment_results(id) ON DELETE CASCADE,
    readiness_score      DECIMAL(5,2)   NOT NULL DEFAULT 0.00,
    technical_score      DECIMAL(5,2)   NOT NULL DEFAULT 0.00,
    aptitude_score       DECIMAL(5,2)   NOT NULL DEFAULT 0.00,
    communication_score  DECIMAL(5,2)   NOT NULL DEFAULT 0.00,
    behavioral_score     DECIMAL(5,2)   NOT NULL DEFAULT 0.00,
    created_at           TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    updated_at           TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

-- ── placement_insights ────────────────────────────────────────
CREATE TABLE placement_insights (
    id                   UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id              UUID           NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    profile_id           UUID           NOT NULL REFERENCES placement_profiles(id) ON DELETE CASCADE,
    assessment_result_id UUID           NOT NULL REFERENCES assessment_results(id) ON DELETE CASCADE,
    insight_type         VARCHAR(50)    NOT NULL, -- STRENGTH, WEAKNESS, WARNING
    category             VARCHAR(50)    NOT NULL, -- TECHNICAL, APTITUDE, COMMUNICATION, BEHAVIORAL
    title                VARCHAR(255)   NOT NULL,
    description          TEXT           NOT NULL,
    created_at           TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    updated_at           TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_placement_insight_unique UNIQUE (assessment_result_id, category, insight_type)
);

-- ── placement_recommendations ─────────────────────────────────
CREATE TABLE placement_recommendations (
    id                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID            NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    profile_id          UUID            NOT NULL REFERENCES placement_profiles(id) ON DELETE CASCADE,
    assessment_result_id UUID           NOT NULL REFERENCES assessment_results(id) ON DELETE CASCADE,
    recommendation_type VARCHAR(50)     NOT NULL, -- ROADMAP_ACTION, COURSE_SUGGESTION, etc.
    title               VARCHAR(255)    NOT NULL,
    description         TEXT            NOT NULL,
    action_url          VARCHAR(255),
    is_active           BOOLEAN         NOT NULL DEFAULT TRUE,
    insight_id          UUID            REFERENCES placement_insights(id) ON DELETE SET NULL,
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- Partial unique index to prevent duplicate active recommendations per profile
CREATE UNIQUE INDEX uq_active_placement_rec ON placement_recommendations(profile_id, recommendation_type, title) WHERE (is_active = true);

-- ── company_fit_scores ────────────────────────────────────────
CREATE TABLE company_fit_scores (
    id                   UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id           UUID           NOT NULL REFERENCES placement_profiles(id) ON DELETE CASCADE,
    assessment_result_id UUID           NOT NULL REFERENCES assessment_results(id) ON DELETE CASCADE,
    target_company       VARCHAR(255)   NOT NULL,
    target_role          VARCHAR(255)   NOT NULL,
    fit_score            INTEGER        NOT NULL,
    confidence_level     VARCHAR(50)    NOT NULL, -- HIGH, MEDIUM, LOW
    created_at           TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    updated_at           TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_company_fit_unique UNIQUE (assessment_result_id, target_company, target_role)
);

-- ── skill_gap_analysis ────────────────────────────────────────
CREATE TABLE skill_gap_analysis (
    id                   UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id           UUID           NOT NULL REFERENCES placement_profiles(id) ON DELETE CASCADE,
    assessment_result_id UUID           NOT NULL REFERENCES assessment_results(id) ON DELETE CASCADE,
    skill_id             BIGINT         NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    skill_name           VARCHAR(100)   NOT NULL,
    gap_type             VARCHAR(50)    NOT NULL, -- CRITICAL, MODERATE, MINOR
    severity             VARCHAR(50)    NOT NULL, -- HIGH, MEDIUM, LOW
    recommended_action   VARCHAR(255)   NOT NULL,
    created_at           TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    updated_at           TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_skill_gap_unique UNIQUE (assessment_result_id, skill_id)
);

-- ── Indexes ───────────────────────────────────────────────────
CREATE INDEX idx_placement_readiness_profile     ON placement_readiness(profile_id);
CREATE INDEX idx_placement_readiness_result      ON placement_readiness(assessment_result_id);
CREATE INDEX idx_placement_insights_user         ON placement_insights(user_id);
CREATE INDEX idx_placement_insights_profile      ON placement_insights(profile_id);
CREATE INDEX idx_placement_insights_result       ON placement_insights(assessment_result_id);
CREATE INDEX idx_placement_recs_user             ON placement_recommendations(user_id);
CREATE INDEX idx_placement_recs_profile          ON placement_recommendations(profile_id);
CREATE INDEX idx_placement_recs_result           ON placement_recommendations(assessment_result_id);
CREATE INDEX idx_company_fit_profile             ON company_fit_scores(profile_id);
CREATE INDEX idx_company_fit_result              ON company_fit_scores(assessment_result_id);
CREATE INDEX idx_skill_gap_profile               ON skill_gap_analysis(profile_id);
CREATE INDEX idx_skill_gap_result                ON skill_gap_analysis(assessment_result_id);
CREATE INDEX idx_skill_gap_skill                 ON skill_gap_analysis(skill_id);

-- ── Triggers ──────────────────────────────────────────────────
CREATE TRIGGER trg_placement_readiness_updated_at
    BEFORE UPDATE ON placement_readiness
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_placement_insights_updated_at
    BEFORE UPDATE ON placement_insights
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_placement_recs_updated_at
    BEFORE UPDATE ON placement_recommendations
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_company_fit_updated_at
    BEFORE UPDATE ON company_fit_scores
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_skill_gap_updated_at
    BEFORE UPDATE ON skill_gap_analysis
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
