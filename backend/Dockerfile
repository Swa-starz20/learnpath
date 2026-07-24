# ============================================================
#  LearnPath Backend — Dockerfile
#  Two-stage build: Maven build → minimal JRE runtime
# ============================================================

# ── Stage 1: Build ────────────────────────────────────────────
FROM eclipse-temurin:17-jdk-alpine AS build

WORKDIR /build

# Copy POM first (layer caching — avoids re-downloading deps on code changes)
COPY pom.xml .

# Download all dependencies (cached layer unless pom.xml changes)
RUN --mount=type=cache,target=/root/.m2 \
    mvn dependency:go-offline -B

# Copy source and build
COPY src ./src
RUN --mount=type=cache,target=/root/.m2 \
    mvn clean package -DskipTests -B

# ── Stage 2: Runtime ──────────────────────────────────────────
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Create a non-root user for security
RUN addgroup -S learnpath && adduser -S learnpath -G learnpath

# Copy the fat JAR from the build stage
COPY --from=build /build/target/learnpath-backend-*.jar app.jar

# Change ownership to the non-root user
RUN chown learnpath:learnpath app.jar

USER learnpath

EXPOSE 8080

# JVM tuning for containerised environment
ENTRYPOINT ["java", \
  "-XX:+UseContainerSupport", \
  "-XX:MaxRAMPercentage=75.0", \
  "-XX:+ExitOnOutOfMemoryError", \
  "-Djava.security.egd=file:/dev/./urandom", \
  "-jar", "app.jar"]
