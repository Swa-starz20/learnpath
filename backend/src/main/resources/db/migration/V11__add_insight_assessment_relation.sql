-- ============================================================
-- V11 — Add Assessment Result Relation to Mentor Insights
-- LearnPath Backend · Flyway Migration
-- ============================================================
-- Owner: mentor module
-- Depends on: V10
-- ============================================================

ALTER TABLE mentor_insights 
ADD COLUMN assessment_result_id UUID REFERENCES assessment_results(id) ON DELETE CASCADE;

CREATE INDEX idx_mentor_insights_result ON mentor_insights(assessment_result_id);
