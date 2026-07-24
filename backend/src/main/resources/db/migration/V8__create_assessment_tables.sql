-- ============================================================
-- V8 — Assessment Tables
-- LearnPath Backend · Flyway Migration
-- ============================================================
-- Owner: assessment module
-- Depends on: V1 (set_updated_at function, pgcrypto extension)
--             V3 (domains table)
--             V4 (skills table)
-- ============================================================

-- ── assessment_templates ─────────────────────────────────────
-- Defines reusable assessment blueprints per domain.
-- code is unique so templates can be referenced by slug/code.
CREATE TABLE assessment_templates (
    id               UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    code             VARCHAR(100) NOT NULL UNIQUE,
    name             VARCHAR(200) NOT NULL,
    description      TEXT,
    assessment_type  VARCHAR(50)  NOT NULL DEFAULT 'QUIZ',
    domain_id        BIGINT       NOT NULL REFERENCES domains(id) ON DELETE RESTRICT,
    duration_minutes INTEGER,
    total_questions  INTEGER      NOT NULL DEFAULT 0,
    is_active        BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_template_duration     CHECK (duration_minutes IS NULL OR duration_minutes > 0),
    CONSTRAINT chk_template_total_q      CHECK (total_questions >= 0)
);

CREATE INDEX idx_assessment_templates_domain    ON assessment_templates(domain_id);
CREATE INDEX idx_assessment_templates_is_active ON assessment_templates(is_active);
CREATE INDEX idx_assessment_templates_type      ON assessment_templates(assessment_type);

CREATE TRIGGER trg_assessment_templates_updated_at
    BEFORE UPDATE ON assessment_templates
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── assessment_questions ──────────────────────────────────────
-- Individual questions belonging to a template.
CREATE TABLE assessment_questions (
    id             UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id    UUID         NOT NULL REFERENCES assessment_templates(id) ON DELETE CASCADE,
    question_text  TEXT         NOT NULL,
    question_type  VARCHAR(50)  NOT NULL DEFAULT 'MULTIPLE_CHOICE',
    difficulty_level VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
    skill_id       BIGINT       REFERENCES skills(id) ON DELETE SET NULL,
    display_order  INTEGER      NOT NULL DEFAULT 0,
    created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_assessment_questions_template  ON assessment_questions(template_id);
CREATE INDEX idx_assessment_questions_skill     ON assessment_questions(skill_id);
CREATE INDEX idx_assessment_questions_order     ON assessment_questions(template_id, display_order);

CREATE TRIGGER trg_assessment_questions_updated_at
    BEFORE UPDATE ON assessment_questions
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── assessment_options ────────────────────────────────────────
-- Answer options for each question (multiple-choice).
-- is_correct is stored here to enable server-side scoring in future phases.
CREATE TABLE assessment_options (
    id            UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id   UUID         NOT NULL REFERENCES assessment_questions(id) ON DELETE CASCADE,
    option_text   TEXT         NOT NULL,
    option_value  VARCHAR(100) NOT NULL,
    display_order INTEGER      NOT NULL DEFAULT 0,
    is_correct    BOOLEAN      NOT NULL DEFAULT FALSE
);

CREATE INDEX idx_assessment_options_question ON assessment_options(question_id);
CREATE INDEX idx_assessment_options_order    ON assessment_options(question_id, display_order);

-- ── assessment_sessions ───────────────────────────────────────
-- One session per user attempt. Business rule: one active session
-- per (user_id, template_id) enforced via partial unique index.
CREATE TABLE assessment_sessions (
    id                  UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID         NOT NULL,
    template_id         UUID         NOT NULL REFERENCES assessment_templates(id) ON DELETE RESTRICT,
    status              VARCHAR(30)  NOT NULL DEFAULT 'IN_PROGRESS',
    started_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    submitted_at        TIMESTAMPTZ,
    time_spent_seconds  INTEGER,
    CONSTRAINT chk_session_status CHECK (status IN ('IN_PROGRESS', 'SUBMITTED', 'EXPIRED')),
    CONSTRAINT chk_session_time   CHECK (time_spent_seconds IS NULL OR time_spent_seconds >= 0)
);

CREATE INDEX idx_assessment_sessions_user           ON assessment_sessions(user_id);
CREATE INDEX idx_assessment_sessions_template       ON assessment_sessions(template_id);
CREATE INDEX idx_assessment_sessions_user_template  ON assessment_sessions(user_id, template_id);
CREATE INDEX idx_assessment_sessions_status         ON assessment_sessions(status);

-- Partial unique index: only one IN_PROGRESS session per user+template at a time.
CREATE UNIQUE INDEX uq_assessment_sessions_active
    ON assessment_sessions(user_id, template_id)
    WHERE status = 'IN_PROGRESS';

-- ── assessment_answers ────────────────────────────────────────
-- One row per question answered within a session.
-- UNIQUE(session_id, question_id) prevents double-answering a question.
CREATE TABLE assessment_answers (
    id                 UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id         UUID         NOT NULL REFERENCES assessment_sessions(id) ON DELETE CASCADE,
    question_id        UUID         NOT NULL REFERENCES assessment_questions(id) ON DELETE CASCADE,
    selected_option_id UUID         REFERENCES assessment_options(id) ON DELETE SET NULL,
    answer_text        TEXT,
    answered_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_answer_per_question UNIQUE (session_id, question_id)
);

CREATE INDEX idx_assessment_answers_session  ON assessment_answers(session_id);
CREATE INDEX idx_assessment_answers_question ON assessment_answers(question_id);

-- ── assessment_results ────────────────────────────────────────
-- One result per submitted session (UNIQUE on session_id).
-- score_percentage defaults to 0 — scoring engine is Phase 3B+.
CREATE TABLE assessment_results (
    id               UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id       UUID         NOT NULL UNIQUE REFERENCES assessment_sessions(id) ON DELETE RESTRICT,
    user_id          UUID         NOT NULL,
    template_id      UUID         NOT NULL REFERENCES assessment_templates(id) ON DELETE RESTRICT,
    score_percentage NUMERIC(5,2) NOT NULL DEFAULT 0.00,
    completed_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_result_score CHECK (score_percentage >= 0 AND score_percentage <= 100)
);

CREATE INDEX idx_assessment_results_user     ON assessment_results(user_id);
CREATE INDEX idx_assessment_results_template ON assessment_results(template_id);
CREATE INDEX idx_assessment_results_session  ON assessment_results(session_id);
