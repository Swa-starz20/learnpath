-- ============================================================
-- V2 — Seed Reference Data: Roles
-- LearnPath Backend · Flyway Migration
-- ============================================================
-- Owner: auth module
-- Depends on: V1 (roles table must exist)
-- ============================================================
-- These roles are referenced by code via string constants (AppConstants).
-- Do NOT change the name values without updating AppConstants.ROLE_STUDENT
-- and AppConstants.ROLE_ADMIN.
-- ============================================================

INSERT INTO roles (name, description) VALUES
    ('STUDENT', 'Default role assigned to all registered learners. Grants access to learning, assessment, roadmap, mentor, and placement features.'),
    ('ADMIN',   'Administrative role with access to platform management, aggregate analytics, seed data endpoints, and all student data.');
