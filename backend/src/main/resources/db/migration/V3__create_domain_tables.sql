-- ============================================================
-- V3 — Domain Tables + 12 Engineering Domain Seed Data
-- LearnPath Backend · Flyway Migration
-- ============================================================
-- Owner: domain module
-- Depends on: V1 (set_updated_at function must exist)
-- ============================================================

CREATE TABLE domains (
    id          BIGSERIAL       PRIMARY KEY,
    code        VARCHAR(50)     NOT NULL UNIQUE,
    name        VARCHAR(100)    NOT NULL,
    description TEXT,
    icon_name   VARCHAR(50),
    is_active   BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_domains_code      ON domains(code);
CREATE INDEX idx_domains_is_active ON domains(is_active);

-- ── Updated-at trigger ────────────────────────────────────────
CREATE TRIGGER trg_domains_updated_at
    BEFORE UPDATE ON domains
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── Seed: 12 Engineering Domains ─────────────────────────────
INSERT INTO domains (code, name, description, icon_name) VALUES
    ('COMP_ENG',     'Computer Engineering',    'Software, hardware, and systems design for computing platforms',           'cpu'),
    ('AI_ML',        'AI / ML Engineering',     'Artificial intelligence, machine learning, and data science systems',      'brain'),
    ('ROBOTICS',     'Robotics Engineering',    'Autonomous systems, robotic design, and real-time control',                'robot'),
    ('MECHATRONICS', 'Mechatronics Engineering','Integration of mechanical, electrical, and software systems',              'gear'),
    ('MECHANICAL',   'Mechanical Engineering',  'Mechanics, thermodynamics, fluid dynamics, and manufacturing processes',   'wrench'),
    ('CIVIL',        'Civil Engineering',       'Structural, geotechnical, transportation, and environmental engineering',  'building'),
    ('ELECTRICAL',   'Electrical Engineering',  'Power systems, electric machines, and high-voltage engineering',           'zap'),
    ('ELECTRONICS',  'Electronics Engineering', 'Electronic circuits, embedded systems, and semiconductor devices',         'circuit'),
    ('CHEMICAL',     'Chemical Engineering',    'Chemical processes, reaction engineering, and industrial chemistry',       'flask'),
    ('BIOMEDICAL',   'Biomedical Engineering',  'Medical devices, biomechanics, biotechnology, and healthcare systems',     'heart'),
    ('INDUSTRIAL',   'Industrial Engineering',  'Production systems, operations research, and process optimization',        'factory'),
    ('AEROSPACE',    'Aerospace Engineering',   'Aircraft, spacecraft, propulsion systems, and aerodynamics',              'plane');
