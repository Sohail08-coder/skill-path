# ==============================================================================
# SkillPath-AI Backend Dockerfile (Optimized for Render Cloud Deployment)
# ==============================================================================

# ------------------------------------------------------------------------------
# Stage 1: Build stage with JDK 21
# ------------------------------------------------------------------------------
FROM eclipse-temurin:21-jdk-alpine AS builder

WORKDIR /build

# Copy Maven Wrapper and POM first to leverage Docker layer caching
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./

# Ensure maven wrapper is executable and download dependencies
RUN chmod +x ./mvnw && ./mvnw dependency:go-offline -B

# Copy application source code
COPY src ./src

# Build production Spring Boot executable JAR skipping tests for fast deployment
RUN ./mvnw clean package -DskipTests -B

# ------------------------------------------------------------------------------
# Stage 2: Runtime stage with lightweight JRE 21 Alpine
# ------------------------------------------------------------------------------
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Add unprivileged user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy built JAR from builder stage
COPY --from=builder /build/target/SkillPath-AI-0.0.1-SNAPSHOT.jar app.jar

# Change ownership to unprivileged user
RUN chown appuser:appgroup /app/app.jar

USER appuser

# Render injects PORT dynamically (default 8080)
ENV PORT=8080
ENV JAVA_OPTS="-XX:MaxRAMPercentage=75.0 -XX:+UseG1GC -XX:+ExitOnOutOfMemoryError"

EXPOSE ${PORT}

# Run with container-aware JVM settings and dynamic port binding
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -Dserver.port=${PORT} -Djava.security.egd=file:/dev/./urandom -jar app.jar"]
