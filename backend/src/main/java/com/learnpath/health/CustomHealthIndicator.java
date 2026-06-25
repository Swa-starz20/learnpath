package com.learnpath.health;

import com.learnpath.scheduler.PlatformScheduler;
import org.flywaydb.core.Flyway;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.Connection;

@Component
public class CustomHealthIndicator implements HealthIndicator {

    private final DataSource dataSource;
    private final Flyway flyway;
    private final PlatformScheduler platformScheduler;

    public CustomHealthIndicator(DataSource dataSource, Flyway flyway, PlatformScheduler platformScheduler) {
        this.dataSource = dataSource;
        this.flyway = flyway;
        this.platformScheduler = platformScheduler;
    }

    @Override
    public Health health() {
        Health.Builder builder = new Health.Builder();
        boolean dbUp = checkDatabase();
        boolean flywayUp = checkFlyway();
        boolean schedulerUp = checkScheduler();

        if (dbUp && flywayUp && schedulerUp) {
            builder.up();
        } else {
            builder.down();
        }

        return builder
                .withDetail("database", dbUp ? "CONNECTED" : "DISCONNECTED")
                .withDetail("flyway", flywayUp ? "SYNCHRONIZED" : "PENDING_MIGRATIONS_OR_ERROR")
                .withDetail("scheduler", schedulerUp ? "ACTIVE" : "INACTIVE")
                .build();
    }

    private boolean checkDatabase() {
        try (Connection conn = dataSource.getConnection()) {
            return conn.isValid(2);
        } catch (Exception e) {
            return false;
        }
    }

    private boolean checkFlyway() {
        try {
            return flyway.info().pending().length == 0;
        } catch (Exception e) {
            return false;
        }
    }

    private boolean checkScheduler() {
        return platformScheduler != null;
    }
}
