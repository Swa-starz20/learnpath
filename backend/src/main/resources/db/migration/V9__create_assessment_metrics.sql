-- ============================================================
-- V9 — Assessment Metrics Table
-- LearnPath Backend · Flyway Migration
-- ============================================================
-- Owner: assessment module
-- Depends on: V8 (assessment_templates, assessment_results)
-- ============================================================

CREATE TABLE assessment_metrics (
    id                     UUID         PRIMARY KEY,
    assessment_result_id   UUID         UNIQUE NOT NULL REFERENCES assessment_results(id) ON DELETE CASCADE,
    user_id                UUID         NOT NULL,
    template_id            UUID         NOT NULL REFERENCES assessment_templates(id) ON DELETE RESTRICT,
    technical_score        DECIMAL(5,2),
    aptitude_score         DECIMAL(5,2),
    behavioral_score       DECIMAL(5,2),
    communication_score    DECIMAL(5,2),
    domain_readiness_score DECIMAL(5,2),
    overall_score          DECIMAL(5,2),
    computed_at            TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_assessment_metrics_user     ON assessment_metrics(user_id);
CREATE INDEX idx_assessment_metrics_template ON assessment_metrics(template_id);
