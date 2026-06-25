# Tasks — Phase 6B: Analytics Intelligence

- `[x]` Modify database migration `V15__create_analytics_intelligence_tables.sql` to support `DECIMAL(10,2)` for XP predictions
- `[x]` Update JPA Entity `AnalyticsPrediction.java` to support `DECIMAL(10,2)` precision
- `[x]` Implement `AnalyticsPredictionService.java` for lightweight deterministic forecasts
- `[x]` Implement `AnalyticsIntelligenceService.java` to orchestrate snapshot, trend, insight, recommendation, and prediction pipeline
- `[x]` Implement `AnalyticsEventListener.java` listening to `AssessmentCompletedEvent` (AFTER_COMMIT, REQUIRES_NEW)
- `[x]` Expose new intelligence endpoints in `AnalyticsController.java`
- `[x]` Refactor `AnalyticsService.java` to support query retrieval operations for REST endpoints
- `[x]` Create unit test `AnalyticsTrendAnalyzerTest.java`
- `[x]` Create unit test `AnalyticsInsightGeneratorTest.java`
- `[x]` Create unit test `AnalyticsPredictionServiceTest.java`
- `[x]` Create integration test `AnalyticsIntelligenceIntegrationTest.java`
- `[/]` Run all tests (`mvn clean test`)
