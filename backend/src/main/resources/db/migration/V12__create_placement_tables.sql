-- ============================================================
-- V12 — Placement Schema
-- LearnPath Backend · Flyway Migration
-- ============================================================
-- Owner: placement module
-- Depends on: V1 (users, set_updated_at), V3 (domains)
-- ============================================================

-- ── placement_profiles ────────────────────────────────────────
CREATE TABLE placement_profiles (
    id                 UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id            UUID           NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    domain_id          BIGINT         REFERENCES domains(id) ON DELETE SET NULL,
    current_cgpa       DECIMAL(4,2),
    target_package_lpa DECIMAL(6,2),
    preferred_location VARCHAR(200),
    created_at         TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    updated_at         TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_user_domain_placement UNIQUE (user_id, domain_id)
);

-- ── placement_targets ─────────────────────────────────────────
CREATE TABLE placement_targets (
    id           UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id   UUID          NOT NULL REFERENCES placement_profiles(id) ON DELETE CASCADE,
    company_name VARCHAR(255)  NOT NULL,
    role_name    VARCHAR(255)  NOT NULL,
    priority     INTEGER       NOT NULL DEFAULT 1,
    created_at   TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ── placement_preferences ─────────────────────────────────────
CREATE TABLE placement_preferences (
    id                     UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id             UUID         NOT NULL UNIQUE REFERENCES placement_profiles(id) ON DELETE CASCADE,
    prefers_remote         BOOLEAN      NOT NULL DEFAULT FALSE,
    prefers_hybrid         BOOLEAN      NOT NULL DEFAULT FALSE,
    prefers_onsite         BOOLEAN      NOT NULL DEFAULT FALSE,
    preferred_company_size VARCHAR(50),
    preferred_industry     VARCHAR(100),
    created_at             TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at             TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ── Indexes ───────────────────────────────────────────────────
CREATE INDEX idx_placement_profiles_user        ON placement_profiles(user_id);
CREATE INDEX idx_placement_targets_profile      ON placement_targets(profile_id);
CREATE INDEX idx_placement_preferences_profile  ON placement_preferences(profile_id);

-- ── Triggers ──────────────────────────────────────────────────
CREATE TRIGGER trg_placement_profiles_updated_at
    BEFORE UPDATE ON placement_profiles
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_placement_preferences_updated_at
    BEFORE UPDATE ON placement_preferences
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
