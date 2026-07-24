-- ============================================================
-- V4 — Skill Tables
-- LearnPath Backend · Flyway Migration
-- ============================================================
-- Owner: skill module
-- Depends on: V3 (domains table)
-- ============================================================

-- ── skills ─────────────────────────────────────────────────
CREATE TABLE skills (
    id          BIGSERIAL       PRIMARY KEY,
    domain_id   BIGINT          NOT NULL REFERENCES domains(id) ON DELETE CASCADE,
    name        VARCHAR(100)    NOT NULL,
    description TEXT,
    category    VARCHAR(50),
    created_at  TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_skills_domain_id ON skills(domain_id);
CREATE INDEX idx_skills_category  ON skills(category);

-- ── user_skills ─────────────────────────────────────────────
CREATE TABLE user_skills (
    id               BIGSERIAL    PRIMARY KEY,
    user_id          UUID         NOT NULL,
    skill_id         BIGINT       NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    confidence_score NUMERIC(5,2) NOT NULL DEFAULT 0.00,
    mastery_level    VARCHAR(20)  NOT NULL DEFAULT 'BEGINNER',
    last_assessed_at TIMESTAMPTZ,
    created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_user_skill UNIQUE (user_id, skill_id),
    CONSTRAINT chk_confidence_score CHECK (confidence_score >= 0 AND confidence_score <= 100)
);

CREATE INDEX idx_user_skills_user_id  ON user_skills(user_id);
CREATE INDEX idx_user_skills_skill_id ON user_skills(skill_id);

-- ── Triggers ─────────────────────────────────────────────────
CREATE TRIGGER trg_skills_updated_at
    BEFORE UPDATE ON skills
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_user_skills_updated_at
    BEFORE UPDATE ON user_skills
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
