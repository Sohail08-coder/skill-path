# SkillPath AI — Implementation Plan: Future Engineering Roadmap

> **Document Version**: 3.0.0  
> **Date**: October 11, 2026  
> **Status**: Strategic Post-Audit Implementation Recommendations  
> **Application State**: Autumn Harvest Palette Implemented & System Inventory Completed

---

## 1. Executive Summary

With the Autumn Harvest solid-color visual identity established and the comprehensive system audit completed, this document outlines prioritized recommendations for subsequent engineering phases. 

As mandated by project constraints, broad backend refactoring and schema modifications were intentionally deferred during this audit phase. The recommendations below are ranked by architectural and operational impact.

---

## 2. Prioritized Strategic Roadmap

```
PHASE 1 (Completed):
  - Autumn Harvest 5-color solid palette migration (Zero Gradients)
  - Route protection and pre-login data shielding
  - Comprehensive system inventory and defect register
          |
          v
PHASE 2 (Recommended Next):
  - Database Entity Relationship & Foreign Key Hardening
  - Database Migration Tooling (Flyway / Liquibase)
  - Concurrency & Optimistic Locking on Milestone Sync
          |
          v
PHASE 3:
  - Unified SPA Routing & Legacy MVC Retirement
  - Strict Environment Variable Configuration
          |
          v
PHASE 4:
  - Generative AI Roadmap Tailoring & Live Job Market API Integration
```

---

## 3. Detailed Phase Breakdown

### Priority 1: Entity Relationship & Data Integrity Hardening
- **Objective**: Establish strict relational integrity between user accounts and persistent evaluation records.
- **Current State**: `AssessmentRecord.userId` is stored as a loose `Long` without a JPA entity relation or database-level foreign key constraint.
- **Recommended Action**:
  - Update `AssessmentRecord.java` to declare `@ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "user_id", nullable = false) private User user;`.
  - Add `onDelete = CascadeAction.CASCADE` or configure orphan removal to prevent dangling records when a user account is deleted.
- **Risk & Mitigation**: Existing rows with null `userId` must be migrated or assigned before applying non-null constraints.

### Priority 2: Database Migration Tooling (Flyway / Liquibase)
- **Objective**: Replace Hibernate's automatic `ddl-auto: update` with version-controlled, repeatable SQL migrations.
- **Current State**: Schema mutations rely on Hibernate entity reflection, risking unintended column alteration in production environments.
- **Recommended Action**:
  - Add `flyway-core` and `flyway-mysql` dependencies to `pom.xml`.
  - Create baseline migration `V1__init_schema.sql` covering `app_users`, `students`, and `assessment_records`.
  - Configure `spring.jpa.hibernate.ddl-auto=validate` for production profiles.

### Priority 3: Milestone Progress Concurrency & Optimistic Locking
- **Objective**: Prevent last-write-wins race conditions during rapid milestone topic toggles.
- **Current State**: `POST /api/students/update-progress` overwrites the `completedMilestoneTopics` column directly without version checking.
- **Recommended Action**:
  - Add `@Version private Long version;` to `AssessmentRecord`.
  - Handle `OptimisticLockingFailureException` gracefully with client-side retry or notification.
  - Implement a 300ms debounce on the frontend checkbox event listener in `roadmap.js` to batch rapid topic clicks.

### Priority 4: Production Configuration & Secret Management
- **Objective**: Prevent insecure default credentials and fallback secrets from running in production.
- **Current State**: `jwt.secret` has a default literal string in `application.properties`.
- **Recommended Action**:
  - Enforce mandatory environment variable substitution: `jwt.secret=${JWT_SECRET}` without hardcoded fallbacks.
  - Fail application startup if `JWT_SECRET` has fewer than 256 bits of entropy or matches known default test strings.

### Priority 5: Legacy MVC Controller Retirement
- **Objective**: Eliminate duplicate routing paths and potential confusion between port 8080 MVC endpoints and port 5500 SPA pages.
- **Current State**: `HomeController` maps `/` to a Thymeleaf `index.html`, and `StudentController` maps `/profile` to a Thymeleaf `profile.html`.
- **Recommended Action**:
  - Either bundle the static `frontend/` files into Spring Boot's `src/main/resources/static/` directory so port 8080 serves the modern SPA directly, or deprecate the Thymeleaf templates and let Spring Boot function purely as a headless REST API backend.

---

## 4. Verification & Testing Strategy for Next Phase

1. **Database Migration Tests**: Verify clean schema creation using Testcontainers running real MySQL 8.0 instances.
2. **Concurrency Integration Tests**: Simulate concurrent `update-progress` HTTP requests using multi-threaded test runners (`CompletableFuture.allOf()`).
3. **End-to-End E2E Tests**: Implement Playwright / Cypress browser test suites to automate multi-page regression checks across the full student lifecycle.
