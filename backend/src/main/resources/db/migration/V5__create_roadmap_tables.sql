-- ============================================================
-- V5 — Roadmap Tables
-- LearnPath Backend · Flyway Migration
-- ============================================================
-- Owner: roadmap module
-- Depends on: V3 (domains), V4 (skills)
-- ============================================================

-- ── career_tracks ────────────────────────────────────────────
CREATE TABLE career_tracks (
    id                       BIGSERIAL    PRIMARY KEY,
    domain_id                BIGINT       NOT NULL REFERENCES domains(id) ON DELETE CASCADE,
    name                     VARCHAR(100) NOT NULL,
    description              TEXT,
    difficulty_level         VARCHAR(20)  NOT NULL DEFAULT 'INTERMEDIATE',
    estimated_duration_weeks INTEGER,
    is_active                BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at               TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at               TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_career_tracks_domain_id ON career_tracks(domain_id);
CREATE INDEX idx_career_tracks_is_active ON career_tracks(is_active);

-- ── roadmap_nodes ────────────────────────────────────────────
CREATE TABLE roadmap_nodes (
    id              BIGSERIAL    PRIMARY KEY,
    career_track_id BIGINT       NOT NULL REFERENCES career_tracks(id) ON DELETE CASCADE,
    title           VARCHAR(200) NOT NULL,
    description     TEXT,
    node_type       VARCHAR(30)  NOT NULL DEFAULT 'TOPIC',
    order_index     INTEGER      NOT NULL DEFAULT 0,
    estimated_hours INTEGER,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_roadmap_nodes_track_id ON roadmap_nodes(career_track_id);
CREATE INDEX idx_roadmap_nodes_order    ON roadmap_nodes(career_track_id, order_index);

-- ── roadmap_edges ────────────────────────────────────────────
CREATE TABLE roadmap_edges (
    id              BIGSERIAL   PRIMARY KEY,
    career_track_id BIGINT      NOT NULL REFERENCES career_tracks(id) ON DELETE CASCADE,
    source_node_id  BIGINT      NOT NULL REFERENCES roadmap_nodes(id) ON DELETE CASCADE,
    target_node_id  BIGINT      NOT NULL REFERENCES roadmap_nodes(id) ON DELETE CASCADE,
    edge_type       VARCHAR(30) NOT NULL DEFAULT 'PREREQUISITE',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_roadmap_edge UNIQUE (source_node_id, target_node_id)
);

CREATE INDEX idx_roadmap_edges_track  ON roadmap_edges(career_track_id);
CREATE INDEX idx_roadmap_edges_source ON roadmap_edges(source_node_id);
CREATE INDEX idx_roadmap_edges_target ON roadmap_edges(target_node_id);

-- ── roadmap_node_skills ──────────────────────────────────────
-- Architecture requirement: skill_id FK → skills.id (approved correction #4)
CREATE TABLE roadmap_node_skills (
    roadmap_node_id BIGINT NOT NULL REFERENCES roadmap_nodes(id) ON DELETE CASCADE,
    skill_id        BIGINT NOT NULL REFERENCES skills(id)        ON DELETE CASCADE,
    PRIMARY KEY (roadmap_node_id, skill_id)
);

CREATE INDEX idx_roadmap_node_skills_skill ON roadmap_node_skills(skill_id);

-- ── user_roadmap_progress ────────────────────────────────────
CREATE TABLE user_roadmap_progress (
    id              BIGSERIAL   PRIMARY KEY,
    user_id         UUID        NOT NULL,
    career_track_id BIGINT      NOT NULL REFERENCES career_tracks(id) ON DELETE CASCADE,
    roadmap_node_id BIGINT      NOT NULL REFERENCES roadmap_nodes(id) ON DELETE CASCADE,
    status          VARCHAR(20) NOT NULL DEFAULT 'NOT_STARTED',
    completed_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_user_roadmap_node UNIQUE (user_id, roadmap_node_id)
);

CREATE INDEX idx_user_roadmap_progress_user  ON user_roadmap_progress(user_id);
CREATE INDEX idx_user_roadmap_progress_track ON user_roadmap_progress(career_track_id);
CREATE INDEX idx_user_roadmap_progress_node  ON user_roadmap_progress(roadmap_node_id);

-- ── Triggers ─────────────────────────────────────────────────
CREATE TRIGGER trg_career_tracks_updated_at
    BEFORE UPDATE ON career_tracks
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_roadmap_nodes_updated_at
    BEFORE UPDATE ON roadmap_nodes
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_user_roadmap_progress_updated_at
    BEFORE UPDATE ON user_roadmap_progress
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
