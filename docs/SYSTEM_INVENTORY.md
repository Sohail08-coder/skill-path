# SkillPath AI — Complete System Inventory & Technical Architecture

> **Document Version**: 2.0.0  
> **Date**: October 11, 2026  
> **Status**: Verified Source Audit  
> **Visual Identity**: Autumn Harvest Solid Design System (Zero Gradients)

---

## Executive Summary

SkillPath AI is a full-stack student engineering career readiness and skill gap planning platform. It enables undergraduate engineering students to benchmark their current academic course preparation against 16 real-world tech industry roles, discover priority skill gaps, generate milestone-based learning roadmaps, track granular topic mastery, calculate live readiness scores, test skills with calibration quizzes, and evaluate resume keyword fit against modern Applicant Tracking System (ATS) criteria.

This document serves as the comprehensive technical inventory of the application as actually implemented across the codebase.

---

## A. Architecture

### 1. High-Level System Architecture Diagram

```
+-----------------------------------------------------------------------------------+
|                              FRONTEND CLIENT TIER                                 |
|  Vanilla ES6+ JavaScript Modules | Semantic HTML5 | CSS3 Design Token System      |
|  Port: 5500 (Dev Server / Static Host)                                            |
|                                                                                   |
|  [index.html]   [careers.html]   [profile.html]   [roadmap.html]  [dashboard.html]|
|  [login.html]   [register.html]  [quiz.html]      [resume-scanner.html]           |
|                                                                                   |
|  Shared JS:                                                                       |
|    - auth.js (AuthService, token management, route guards, demo login)            |
|    - app.js (Catalog, filters, search, ATS scanner, quiz engine)                 |
|    - roadmap.js (Timeline rendering, checkbox tracking, score meter, sync)        |
+-----------------------------------------------------------------------------------+
                                       |
                   HTTP / REST (JSON)  |  Authorization: Bearer <JWT>
                   CORS Enabled        v
+-----------------------------------------------------------------------------------+
|                              BACKEND SERVICE TIER                                 |
|  Spring Boot 3.3.4 (Java 21) | Port: 8080                                         |
|                                                                                   |
|  Security Filter Chain:                                                           |
|    - JwtAuthFilter (Extracts 'Bearer <token>', validates signature, loads claims) |
|    - SecurityConfig (Stateless sessions, CSRF disabled, CORS whitelist, BCrypt)  |
|                                                                                   |
|  REST Controllers:                                                                |
|    - AuthController (/api/auth/register, /api/auth/login)                         |
|    - StudentRestController (/api/students, /update-progress, /my-history)         |
|    - CareerDataController (/api/careers, /api/careers/{title})                    |
|                                                                                   |
|  Legacy MVC Controllers (Thymeleaf Templates):                                    |
|    - HomeController (GET / -> "index")                                            |
|    - StudentController (GET & POST /profile -> "profile")                         |
|                                                                                   |
|  Business Services:                                                               |
|    - SkillAnalysisService (16 career benchmarks, gap scoring, roadmap synthesis)  |
|    - CustomUserDetailsService (Spring Security user lookup by username/email)    |
+-----------------------------------------------------------------------------------+
                                       |
                        Spring Data JPA / Hibernate
                                       v
+-----------------------------------------------------------------------------------+
|                              DATA PERSISTENCE TIER                                |
|  Primary: MySQL (jdbc:mysql://localhost:3306/skillpath_ai)                        |
|  Test/Fallback: H2 In-Memory (jdbc:h2:mem:skillpath_ai)                           |
|                                                                                   |
|  Tables / Entities:                                                               |
|    - app_users (User: id, username, email, password, role, createdAt)             |
|    - students (Student: id, name, email, branch, year, cgpa, skills, goals, etc.) |
|    - assessment_records (AssessmentRecord: id, userId, careerGoal, score, topics) |
+-----------------------------------------------------------------------------------+
```

### 2. Frontend Technology & Entry Points

- **Technology**: Vanilla HTML5, CSS3, JavaScript (ES6+ modular script loading). No front-end framework runtime overhead (React/Vue/Angular are absent from the active client bundle).
- **Entry Points**:
  - `frontend/index.html`: Public landing page with stream-matching career predictor, live statistics banner, and architectural pipeline overview.
  - Development host: Typically served at `http://localhost:5500` via Python `http.server`, VS Code Live Server, or Nginx.
- **Frontend File Organization**:
  - HTML Files: `index.html`, `careers.html`, `profile.html`, `roadmap.html`, `dashboard.html`, `login.html`, `register.html`, `quiz.html`, `resume-scanner.html`.
  - Stylesheets:
    - `frontend/css/style.css`: Core design system, Autumn Harvest tokens (`:root`), base typography, navigation bar, curved footer, button hierarchy, and form controls.
    - `frontend/css/components.css`: Hero section, stream finder, career cards, skill badges, assessment stepper wizard, roadmap timeline, ATS report cards, quiz options, and toasts.
  - JavaScript Modules:
    - `frontend/js/auth.js`: Singleton `AuthService` handling JWT storage, token decoding, session expiration checks, reactive navbar state updates, route gating cards, and demo student login.
    - `frontend/js/app.js`: Career catalog rendering, branch/difficulty filtering, keyword search, ATS resume scanner algorithm, skill calibration quiz flow, and dashboard history restoration.
    - `frontend/js/roadmap.js`: Milestone timeline construction, live score recalculation based on checked topics, learning resources rendering, and real-time backend synchronization.

### 3. API Client Architecture

- The frontend interacts with backend endpoints via the native `window.fetch()` API.
- Base URL is configured globally via `API_BASE_URL`: defaults to `http://localhost:8080/api` with fallback checks.
- Authenticated requests dynamically inject the HTTP header:
  ```javascript
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${AuthService.getToken()}`
  }
  ```
- **Error Handling**: Responses check `res.ok`. Non-200 responses parse JSON error bodies or trigger toast notifications. 401 Unauthorized responses trigger session cleanup and redirect prompts.

### 4. Backend Framework and Application Entry Point

- **Framework**: Spring Boot 3.3.4 running on Java 21 LTS (`Eclipse Adoptium OpenJDK 21.0.12`).
- **Entry Point**: `com.skillpath.ai.SkillPathAiApplication.java` annotated with `@SpringBootApplication`.
- **Packaging**: Standard Maven JAR / WAR build (`mvnw.cmd package`).

### 5. Spring Security & Middleware Architecture

- **Configuration File**: `com.skillpath.ai.security.SecurityConfig.java`.
- **SecurityFilterChain**:
  - CSRF: Explicitly disabled (`csrf.disable()`) for stateless REST APIs.
  - Session Management: Configured as `SessionCreationPolicy.STATELESS` — no server-side HTTP sessions are maintained.
  - CORS Whitelist: Explicitly allows `http://localhost:5500`, `http://127.0.0.1:5500`, `http://localhost:3000` with `GET`, `POST`, `PUT`, `DELETE`, `OPTIONS` and headers `Authorization`, `Content-Type`, `X-Requested-With`.
  - Endpoint Access Rules:
    - Public: `/`, `/profile`, `/api/auth/**`, `/api/careers/**`, `/api/students/public/**`, static resources (`/css/**`, `/js/**`, `/images/**`).
    - Authenticated: `/api/students`, `/api/students/update-progress`, `/api/students/my-history`, and all other `/api/**` endpoints.
- **Authentication Filter**: `JwtAuthFilter.java` extends `OncePerRequestFilter`. Intercepts every inbound request, extracts the Bearer token, validates signature/expiration via `JwtTokenProvider.java`, loads the `UserDetails`, and populates `SecurityContextHolder.getContext().setAuthentication(...)`.

### 6. AI Integrations & Roadmap Synthesis Engine

- The roadmap synthesis and skill gap identification is implemented in `SkillAnalysisService.java`.
- **Algorithmic Model**:
  - Deterministic Benchmark Knowledge Base: 16 curated industry career profiles (e.g., Software Developer, AI/ML Engineer, Cloud DevOps, Cybersecurity Analyst, Full Stack Developer, Data Scientist, Embedded Systems Engineer, etc.).
  - Benchmark Specification: Each profile declares mandatory core skills, CS fundamentals, tiered milestones (Foundations, Intermediate Architecture, Advanced Production, Capstone Mastery), curated external documentation links, and salary benchmarks.
  - Gap Analysis Algorithm: Parses the student's acquired skills and branch coursework against the target career profile. Computes a weighted readiness percentage:
    $$\text{Readiness Score} = \min\left(95, \max\left(20, \left\lfloor\frac{|\text{Acquired Skills} \cap \text{Required Skills}|}{|\text{Required Skills}|} \times 70\right\rfloor + \text{Branch Match Bonus}\right)\right)$$
  - Milestone Topic Checklists: Checkboxes on each milestone dynamically increment readiness score (+3% per checked topic) up to 100%.

---

## B. User Types and Permission Matrix

SkillPath AI recognizes four distinct user states across its frontend and backend boundaries.

### 1. User Types Defined

1. **Anonymous Public Visitor**: Unauthenticated user accessing the platform via browser without a JWT token.
2. **Authenticated Student**: Registered user possessing a valid JWT token issued by `/api/auth/login` or `/api/auth/register` with role `ROLE_STUDENT`.
3. **Demo Student**: Pre-configured mock student session (`alex.student@skillpath.ai`) generated client-side or through development bypass.
4. **Administrator**: User with `ROLE_ADMIN`. (Note: Reserved in `User.java` and `SecurityConfig.java`, but no dedicated administrative UI views currently exist in the client).

### 2. Route & Permission Matrix

| Page / Resource | Anonymous Visitor | Authenticated Student | Demo Student | Enforced By |
|---|---|---|---|---|
| **Landing (`index.html`)** | Full Public Access | Full Access | Full Access | Public |
| **Catalog (`careers.html`)** | Browse Tracks & Details | Browse & Start Track | Browse & Start Track | Public (Action gated) |
| **Quiz (`quiz.html`)** | Practice calibration quiz | Calibration quiz + Badges | Calibration quiz + Badges | Public |
| **ATS Scanner (`resume-scanner.html`)**| Paste & inspect ATS score| Paste & inspect ATS score | Paste & inspect ATS score | Public |
| **Auth Pages (`login.html`, `register.html`)**| Full Access | Redirects / Available | Redirects / Available | Public |
| **Assessment (`profile.html`)** | Blocked with Sign-In Card | Full Wizard Access | Full Wizard Access | Frontend Guard (`auth.js`) |
| **Active Roadmap (`roadmap.html`)** | Blocked with Sign-In Card | View & Check Milestones | View & Check Milestones | Frontend Guard (`auth.js`) |
| **Dashboard (`dashboard.html`)** | Blocked with Sign-In Card | View Personal History | View Personal History | Frontend Guard (`auth.js`) |
| **POST `/api/auth/register`** | Permitted | Permitted | Permitted | Backend `SecurityConfig` |
| **POST `/api/auth/login`** | Permitted | Permitted | Permitted | Backend `SecurityConfig` |
| **GET `/api/careers/**`** | Permitted | Permitted | Permitted | Backend `SecurityConfig` |
| **POST `/api/students`** | **401 Unauthorized** | Permitted (Creates record) | Permitted (if valid token)| Backend `SecurityConfig` |
| **POST `/api/students/update-progress`** | **401 Unauthorized** | Permitted (Ownership check)| Permitted (Ownership check)| Backend (`StudentRestController`)|
| **GET `/api/students/my-history`** | **401 Unauthorized** | Permitted (Self records only)| Permitted (Self records only)| Backend (`StudentRestController`)|

### 3. Backend Ownership Enforcement

- In `StudentRestController.java`:
  - When updating milestone progress (`POST /api/students/update-progress`), the controller retrieves the authenticated user's ID via `currentUser.getId()`.
  - It loads the target `AssessmentRecord` by ID.
  - If `record.getUserId() != null && !record.getUserId().equals(currentUser.getId())`, the backend immediately aborts and returns `403 Forbidden`.
  - When fetching evaluation history (`GET /api/students/my-history`), the backend queries `assessmentRecordRepository.findByUserIdOrderByCreatedAtDesc(currentUser.getId())`, guaranteeing students can never inspect or modify another student's data.

---

## C. Authentication and Authorization Lifecycle

### 1. Step-by-Step Lifecycle Trace

```
1. REGISTRATION:
   User submits { username, email, password } on register.html
   --> POST /api/auth/register
   --> AuthController verifies:
       - !userRepository.existsByUsername(req.username) [400 if duplicate]
       - !userRepository.existsByEmail(req.email)       [400 if duplicate]
   --> passwordEncoder.encode(req.password) using BCrypt (cost factor 10)
   --> User entity saved to 'app_users' with role 'ROLE_STUDENT'
   --> Returns 200 OK: { message: "User registered successfully" }

2. LOGIN & TOKEN GENERATION:
   User submits { usernameOrEmail, password } on login.html
   --> POST /api/auth/login
   --> authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(user, pass))
   --> CustomUserDetailsService loads User by username OR email
   --> BCrypt matches salted password hash
   --> JwtTokenProvider.generateToken(authentication):
       - Signs HMAC-SHA256 with jwt.secret
       - Injects claims: sub (username), userId, email, roles
       - Expiration: configured via jwt.expiration (default 24h)
   --> Returns 200 OK: { token, tokenType: "Bearer", username, email, role, userId }

3. TOKEN STORAGE & CLIENT RESTORATION:
   --> AuthService.setSession(authData):
       - Stores token in localStorage.getItem('token')
       - Stores user info in localStorage.getItem('user')
   --> Reactive Header Update:
       - Displays user avatar, username badge, and sign-out button
       - Hides login/register buttons

4. PROTECTED ROUTE INTERCEPTION:
   --> User navigates to profile.html, roadmap.html, or dashboard.html
   --> auth.js executes AuthService.requireAuth():
       - Checks AuthService.isAuthenticated()
       - If token missing or expired:
         * Injects clean Autumn Harvest Route Gating Card
         * Preserves target route for post-login redirect
         * Aborts page data initialization

5. AUTHENTICATED API REQUESTS:
   --> Client calls fetch() with header 'Authorization: Bearer <token>'
   --> JwtAuthFilter intercepts request:
       - Extracts string from 'Authorization' header
       - Calls jwtTokenProvider.validateToken(token)
       - Reads username and userId claims
       - Sets UsernamePasswordAuthenticationToken in SecurityContextHolder
   --> Controller method accesses authenticated principal via @AuthenticationPrincipal CustomUserDetails

6. LOGOUT & INVALIDATION:
   --> User clicks 'Sign Out'
   --> AuthService.logout():
       - Clears localStorage tokens and user keys
       - Redirects to index.html with success toast
       - Flushes in-memory auth state
```

---

## D. Major Features & Functional Inventory

### 1. Career-Track Catalogue & Stream Matcher

- **Location**: `frontend/careers.html`, `frontend/index.html`.
- **Frontend Logic**: `renderCareerCards()`, `filterCareers()`, `searchCareers()` in `app.js`.
- **Backend Endpoint**: `GET /api/careers` and `GET /api/careers/{title}` in `CareerDataController.java`.
- **Functionality**:
  - Displays 16 benchmarked technology career paths with difficulty badges, salary metrics, and hiring partner tags.
  - Interactive stream matcher filters tracks relevant to engineering majors (Computer Science, Electronics & Communication, Mechanical, Electrical, Civil).
  - Public visitors can inspect track curriculum; clicking "Start Track" prompts unauthenticated visitors to sign in before taking the intake wizard.

### 2. Student Intake Assessment Wizard

- **Location**: `frontend/profile.html`.
- **Frontend Logic**: Stepper wizard (Steps 1–4), dynamic skill chip toggles, live gap estimator sidebar in `app.js`.
- **Backend Endpoint**: `POST /api/students` in `StudentRestController.java`.
- **Input Fields**:
  - Name, Email, University Branch (CSE, ECE, ME, etc.), Academic Year (1st–4th Year), CGPA (0.0–10.0), Technical Skills (comma-separated), Target Career Goal.
- **Output**: Complete `AnalysisResult` JSON object containing `readinessScore`, `acquiredSkills`, `missingSkills`, `roadmap` milestones, and unique `recordId`.
- **Persistence**: Persists `Student` record and `AssessmentRecord` to the database.

### 3. Personalized Roadmap & Milestone Tracker

- **Location**: `frontend/roadmap.html`.
- **Frontend Logic**: `renderRoadmap()`, `renderScoreMeter()`, `renderTimeline()`, and topic checkbox listener in `roadmap.js`.
- **Backend Endpoint**: `POST /api/students/update-progress` in `StudentRestController.java`.
- **Functionality**:
  - Displays 4 milestone phases: Foundations, Intermediate Architecture, Advanced Production, Capstone Mastery.
  - Checkboxes for individual topics allow students to mark concepts as mastered.
  - SVG radial readiness meter dynamically updates in real time.
  - Checkbox state is synced both to browser `localStorage` and persisted to the backend `AssessmentRecord.completedMilestoneTopics`.

### 4. Student Dashboard & Evaluation History

- **Location**: `frontend/dashboard.html`.
- **Frontend Logic**: `renderDashboard()`, `loadHistoricalRoadmap()` in `app.js`.
- **Backend Endpoint**: `GET /api/students/my-history` in `StudentRestController.java`.
- **Functionality**:
  - Summarizes active target career track, market readiness percentage, strengths, and gap count.
  - Displays chronological history table of all previous assessment submissions.
  - Allows restoring any previously saved roadmap with one click.

### 5. ATS Resume Keyword Scanner

- **Location**: `frontend/resume-scanner.html`.
- **Frontend Logic**: `initResumeScanner()` in `app.js`.
- **Functionality**:
  - Client-side text parser that extracts tokens from pasted resume text.
  - Cross-references keywords against the target role's mandatory skills.
  - Calculates keyword match score, lists detected strengths, highlights missing critical keywords, and outputs actionable resume optimization tips.

### 6. Interactive Skill Calibration Quiz

- **Location**: `frontend/quiz.html`.
- **Frontend Logic**: `initQuizEngine()` in `app.js`.
- **Functionality**:
  - Multi-question technical concept assessment covering core algorithms, systems design, cloud, and security.
  - Real-time feedback with instant answer validation, toast alerts, and final calibration scoring.

---

## E. Tracking and Roadmap Data Flow

### Complete Data Flow Diagram

```
[Student fills Profile Wizard]
              |
              v
[POST /api/students] (with Bearer JWT)
              |
              +---> Saves Student Entity to MySQL/H2
              |
              +---> SkillAnalysisService.generateCompleteRoadmap(student)
              |         * Calculates Readiness Score (e.g. 65%)
              |         * Identifies Strengths & Missing Gaps
              |         * Assembles 4 Milestones with Topic Lists
              |
              +---> Saves AssessmentRecord Entity (linked to user.getId())
              |
              v
[Returns AnalysisResult with recordId to Frontend]
              |
              +---> Saved to localStorage ('latestAnalysisData')
              +---> Redirects to roadmap.html
              |
              v
[roadmap.html: User checks a topic checkbox]
              |
              +---> Client updates completedTopicsSet
              +---> Dynamic live score increases (+3% per topic)
              +---> localStorage.setItem('roadmap_checks_...', ...)
              |
              v
[POST /api/students/update-progress]
              |
              +---> Backend verifies user ownership (record.userId == currentUser.id)
              +---> Updates record.setCompletedMilestoneTopics(completedArray)
              +---> Saves AssessmentRecord to Database
              |
              v
[dashboard.html: GET /api/students/my-history]
              |
              +---> Backend queries database for currentUser.id records
              +---> Renders historical timeline and previous readiness evaluations
```

- **Persistence Guarantee**: Milestone completions and evaluation history survive page refresh, browser restart, and user logout because they are persisted in `assessment_records` in the database.
- **AI Influence vs. Template**: The roadmap milestones are derived from deterministic, benchmarked industry role curricula in `SkillAnalysisService.java`. The readiness score, identified gaps, and stream advisory transition texts are dynamically synthesized based on the student's unique combination of branch, year, CGPA, and acquired skills.

---

## F. API Reference

### 1. Authentication Endpoints

#### `POST /api/auth/register`
- **Purpose**: Register a new student account.
- **Auth Required**: None (Public).
- **Request Body**:
  ```json
  {
    "username": "string (required, unique)",
    "email": "string (required, valid email, unique)",
    "password": "string (required, min 6 chars)"
  }
  ```
- **Responses**:
  - `200 OK`: `{"message": "User registered successfully"}`
  - `400 Bad Request`: `{"error": "Username is already taken!"}` or `{"error": "Email is already in use!"}`

#### `POST /api/auth/login`
- **Purpose**: Authenticate user and issue JWT bearer token.
- **Auth Required**: None (Public).
- **Request Body**:
  ```json
  {
    "usernameOrEmail": "string (required)",
    "password": "string (required)"
  }
  ```
- **Responses**:
  - `200 OK`:
    ```json
    {
      "token": "eyJhbGciOi...",
      "tokenType": "Bearer",
      "username": "student1",
      "email": "student1@example.com",
      "role": "ROLE_STUDENT",
      "userId": 1
    }
    ```
  - `401 Unauthorized`: Invalid credentials.

---

### 2. Student & Assessment Endpoints

#### `POST /api/students`
- **Purpose**: Submit student assessment intake, generate gap analysis, and persist evaluation.
- **Auth Required**: `Bearer <token>` (`ROLE_STUDENT` or `ROLE_ADMIN`).
- **Request Body**:
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "branch": "CSE",
    "year": "3rd Year",
    "cgpa": 8.7,
    "skills": "Java, Python, SQL",
    "interests": "Cloud Computing",
    "projects": "E-Commerce Microservices",
    "certifications": "AWS Cloud Practitioner",
    "careerGoal": "Cloud Engineer"
  }
  ```
- **Responses**:
  - `200 OK`:
    ```json
    {
      "readinessScore": 72,
      "acquiredSkills": ["Java", "Python", "SQL"],
      "missingSkills": ["Docker", "Kubernetes", "Terraform", "CI/CD"],
      "recordId": 14,
      "roadmap": [ ... ],
      "recommendedProjects": [ ... ],
      "recommendedCertifications": [ ... ],
      "learningResources": [ ... ],
      "streamTransitionAdvice": "..."
    }
    ```
  - `401 Unauthorized`: Missing or invalid token.

#### `POST /api/students/update-progress`
- **Purpose**: Save mastered milestone checklist topics.
- **Auth Required**: `Bearer <token>`.
- **Request Body**:
  ```json
  {
    "recordId": 14,
    "completedTopics": ["Linux Basics", "Containerization with Docker", "Kubernetes Pods"]
  }
  ```
- **Responses**:
  - `200 OK`: `{"message": "Progress updated successfully", "completedTopics": [...]}`
  - `403 Forbidden`: Authenticated user does not own `recordId`.
  - `404 Not Found`: Record ID does not exist.

#### `GET /api/students/my-history`
- **Purpose**: Retrieve historical assessment records for the authenticated student.
- **Auth Required**: `Bearer <token>`.
- **Responses**:
  - `200 OK`: Array of `AssessmentRecord` entities owned by the caller.
  - `401 Unauthorized`: Missing or invalid token.

---

### 3. Career Knowledge Endpoints

#### `GET /api/careers`
- **Purpose**: Retrieve all 16 benchmarked tech career tracks.
- **Auth Required**: None (Public).
- **Responses**:
  - `200 OK`: Array of career profiles with titles, categories, difficulty, average salary, and descriptions.

#### `GET /api/careers/{title}`
- **Purpose**: Retrieve deep curriculum specifications for a specific career track.
- **Auth Required**: None (Public).
- **Responses**:
  - `200 OK`: Career profile JSON with core skills, milestones, and hiring partners.
  - `404 Not Found`: Career role not found.

---

## G. Database and Data Integrity

### 1. Entity Specifications

#### Entity: `User` (`app_users`)
- `id`: `Long`, Primary Key, Auto-Increment.
- `username`: `VARCHAR(50)`, Unique, Not Null.
- `email`: `VARCHAR(100)`, Unique, Not Null.
- `password`: `VARCHAR(255)`, Not Null (BCrypt hash).
- `role`: `VARCHAR(20)`, Default `'ROLE_STUDENT'`.
- `createdAt`: `TIMESTAMP`, Default `CURRENT_TIMESTAMP`.

#### Entity: `Student` (`students`)
- `id`: `Long`, Primary Key, Auto-Increment.
- `name`: `VARCHAR(100)`, Not Null.
- `email`: `VARCHAR(100)`, Not Null.
- `branch`: `VARCHAR(50)`.
- `year`: `VARCHAR(20)`.
- `cgpa`: `DOUBLE`.
- `skills`: `TEXT`.
- `interests`: `TEXT`.
- `projects`: `TEXT`.
- `certifications`: `TEXT`.
- `careerGoal`: `VARCHAR(100)`.

#### Entity: `AssessmentRecord` (`assessment_records`)
- `id`: `Long`, Primary Key, Auto-Increment.
- `userId`: `Long` (Foreign reference to `app_users.id`).
- `careerGoal`: `VARCHAR(100)`.
- `readinessScore`: `INTEGER`.
- `acquiredSkills`: `TEXT` (JSON or comma-separated list).
- `missingSkills`: `TEXT`.
- `completedMilestoneTopics`: `TEXT` (JSON array of checked topics).
- `createdAt`: `TIMESTAMP`.

### 2. Data Integrity Analysis & Risks

- **Missing Foreign Key Constraint**: `AssessmentRecord.userId` is stored as a loose `Long` rather than a formal JPA `@ManyToOne` relationship with `User`. An uncascaded deletion of a `User` could result in orphaned assessment records.
- **DDL Management**: Hibernate is set to `ddl-auto: update`. In a production environment, Flyway or Liquibase migrations should be introduced to prevent unintended schema mutation.
- **Text Serialization**: Topics and skill lists are serialized into `TEXT` fields. Concurrent updates to `completedMilestoneTopics` could experience last-write-wins race conditions without pessimistic locking or database versioning (`@Version`).

---

## H. Quality & Defect Register

| ID | Category | Severity | Description | Evidence / File | User Impact | Recommended Remediation |
|---|---|---|---|---|---|---|
| **DEF-01** | Architecture | **Medium** | Redundant Thymeleaf MVC controllers exist alongside the static SPA frontend | `HomeController.java`, `StudentController.java` | Confuses routing if accessed on port 8080 directly (`/` vs `localhost:5500`) | Deprecate or convert legacy controllers to forward directly to SPA static resources |
| **DEF-02** | Data Integrity| **Medium** | Loose `userId` mapping on `AssessmentRecord` lacks database FK constraint | `AssessmentRecord.java` | Potential orphan records if user accounts are purged | Add `@ManyToOne @JoinColumn(name="user_id")` and cascade settings |
| **DEF-03** | Concurrency | **Low** | No `@Version` optimistic locking on milestone progress updates | `StudentRestController.java:62` | Concurrent checkbox clicks from multiple tabs can overwrite topics | Add optimistic locking with `@Version` on `AssessmentRecord` |
| **DEF-04** | Security | **Low** | In-memory token expiration relies on client clock | `auth.js:28` | Clock skew could cause token to appear expired prematurely | Rely on backend 401 response status for authoritative invalidation |
| **DEF-05** | Configuration| **Low** | JWT secret key is hardcoded with default fallback | `application.properties` | Potential security risk if deployed without environment variable override | Enforce mandatory `${JWT_SECRET}` environment variable at runtime |

---

## Verification & Build Summary

- **Backend Build**: Clean Maven compile with JDK 21 (`Eclipse Adoptium OpenJDK 21.0.12`).
- **Backend Test Suite**: 16 out of 16 tests passing across `AuthControllerTest`, `StudentRestControllerTest`, `SkillAnalysisServiceTest`, and `SkillPathAiApplicationTests`.
- **Frontend Assets**: Zero gradient declarations across all CSS, HTML, JS, and SVG files. Autumn Harvest 5-color palette tokens (`#6F1D1B`, `#BB9457`, `#432818`, `#99582A`, `#FFE6A7`) active globally.
