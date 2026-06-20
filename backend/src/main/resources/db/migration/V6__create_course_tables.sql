-- ============================================================
-- V6 — Course Tables
-- LearnPath Backend · Flyway Migration
-- ============================================================
-- Owner: course module
-- Depends on: V3 (domains), V5 (career_tracks)
-- ============================================================

-- ── courses ──────────────────────────────────────────────────
CREATE TABLE courses (
    id               BIGSERIAL    PRIMARY KEY,
    domain_id        BIGINT       NOT NULL REFERENCES domains(id)       ON DELETE CASCADE,
    career_track_id  BIGINT       REFERENCES career_tracks(id)          ON DELETE SET NULL,
    title            VARCHAR(200) NOT NULL,
    description      TEXT,
    slug             VARCHAR(200) NOT NULL UNIQUE,
    difficulty_level VARCHAR(20)  NOT NULL DEFAULT 'BEGINNER',
    estimated_hours  INTEGER,
    is_published     BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_courses_domain_id   ON courses(domain_id);
CREATE INDEX idx_courses_slug        ON courses(slug);
CREATE INDEX idx_courses_is_published ON courses(is_published);
CREATE INDEX idx_courses_track_id    ON courses(career_track_id);

-- ── course_modules ────────────────────────────────────────────
CREATE TABLE course_modules (
    id          BIGSERIAL    PRIMARY KEY,
    course_id   BIGINT       NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title       VARCHAR(200) NOT NULL,
    description TEXT,
    order_index INTEGER      NOT NULL DEFAULT 0,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_course_modules_course ON course_modules(course_id);
CREATE INDEX idx_course_modules_order  ON course_modules(course_id, order_index);

-- ── lessons ──────────────────────────────────────────────────
CREATE TABLE lessons (
    id               BIGSERIAL    PRIMARY KEY,
    module_id        BIGINT       NOT NULL REFERENCES course_modules(id) ON DELETE CASCADE,
    title            VARCHAR(200) NOT NULL,
    content_type     VARCHAR(30)  NOT NULL DEFAULT 'VIDEO',
    content_url      VARCHAR(500),
    order_index      INTEGER      NOT NULL DEFAULT 0,
    duration_minutes INTEGER,
    created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_lessons_module ON lessons(module_id);
CREATE INDEX idx_lessons_order  ON lessons(module_id, order_index);

-- ── completion_records ───────────────────────────────────────
-- Architecture requirement: UNIQUE(user_id, entity_type, entity_id)
-- entity_type included in constraint to prevent cross-entity conflicts
CREATE TABLE completion_records (
    id           BIGSERIAL   PRIMARY KEY,
    user_id      UUID        NOT NULL,
    entity_type  VARCHAR(30) NOT NULL,
    entity_id    BIGINT      NOT NULL,
    completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_completion UNIQUE (user_id, entity_type, entity_id)
);

CREATE INDEX idx_completion_records_user   ON completion_records(user_id);
CREATE INDEX idx_completion_records_entity ON completion_records(entity_type, entity_id);

-- ── Triggers ─────────────────────────────────────────────────
CREATE TRIGGER trg_courses_updated_at
    BEFORE UPDATE ON courses
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_course_modules_updated_at
    BEFORE UPDATE ON course_modules
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_lessons_updated_at
    BEFORE UPDATE ON lessons
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
