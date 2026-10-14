# 🚀 SkillPath AI — Full-Stack Career Navigation & Skill Benchmark Platform

> **Intelligent Career Navigation, Skill Gap Benchmarking & Milestone Roadmap Platform for Students**

SkillPath AI benchmarks student profiles (academic coursework, current skills, projects, CGPA, and career ambitions) against real-world industry requirements. It detects critical skill gaps, computes a quantitative market readiness score, and synthesizes a step-by-step milestone learning roadmap with interactive checklists, capstone blueprints, and certification guides.

---

## 🎨 Design System: Watermelon Sorbet Palette

The user interface adheres to the official **Watermelon Sorbet** color system on clean white/light surfaces with high-contrast deep teal typography:

- **Watermelon Pink**: `#F04470` (Primary action buttons, focus highlights, alert badges)
- **Sorbet Yellow**: `#FFD166` (Attention badges, warnings, secondary accents)
- **Mint Green**: `#06D6A0` (Verified badges, success states, mastered skills)
- **Ocean Blue**: `#118AB2` (Links, secondary buttons, informational elements)
- **Deep Teal**: `#073B4C` (High-contrast typography, navigation anchors, brand titles)

---

## 📁 Project Architecture

The repository is structured into isolated, maintainable frontend and backend modules:

```text
SkillPath-AI/
├── .env.example                  # Environment configuration template
├── README.md                     # Project documentation & run guide
├── docs/
│   └── TECHNICAL_AUDIT.md        # Comprehensive full-stack audit & vulnerability report
├── backend/                      # Spring Boot 4 Java Backend (Java 21)
│   ├── mvnw & mvnw.cmd           # Maven Wrapper
│   ├── pom.xml                   # Dependencies (Spring Security, JJWT, JPA, H2, Validation)
│   └── src/
│       ├── main/
│       │   ├── java/com/skillpath/ai/
│       │   │   ├── SkillPathAiApplication.java
│       │   │   ├── controller/
│       │   │   │   ├── AuthController.java          # REST Auth (/api/auth/register, /api/auth/login, /api/auth/me)
│       │   │   │   ├── CareerRestController.java    # REST Careers (/api/careers, /api/careers/{id})
│       │   │   │   ├── StudentRestController.java   # REST Students (/api/students, /api/analyze, /api/students/my-history)
│       │   │   │   ├── StudentController.java       # Thymeleaf Form Handler (/profile)
│       │   │   │   └── HomeController.java          # Root Route (/)
│       │   │   ├── security/
│       │   │   │   ├── SecurityConfig.java          # Spring Security FilterChain & CORS
│       │   │   │   ├── JwtTokenProvider.java        # HMAC-SHA256 Token Signer & Validator
│       │   │   │   ├── JwtAuthenticationFilter.java # Bearer Token Filter
│       │   │   │   ├── CustomUserDetailsService.java# User Loader
│       │   │   │   ├── JwtAuthenticationEntryPoint.java
│       │   │   │   └── CustomAccessDeniedHandler.java
│       │   │   ├── model/
│       │   │   │   ├── User.java                    # User Account Entity (BCrypt Hashed)
│       │   │   │   ├── Student.java                 # Student Profile JPA Entity
│       │   │   │   ├── AssessmentRecord.java        # Persisted Student Assessment History
│       │   │   │   ├── CareerPath.java              # Industry Career Track Benchmark Model
│       │   │   │   ├── AnalysisResult.java          # Readiness Score & Gaps DTO
│       │   │   │   └── RoadmapStep.java             # Milestone Step Model with Topics
│       │   │   ├── repository/
│       │   │   │   ├── UserRepository.java          # Spring Data JPA User Repository
│       │   │   │   ├── StudentRepository.java       # Spring Data JPA Student Repository
│       │   │   │   └── AssessmentRecordRepository.java # JPA Repository for Assessment History
│       │   │   ├── service/
│       │   │   │   ├── CareerCatalogService.java    # Benchmark Catalog for 12+ Engineering Roles
│       │   │   │   └── SkillAnalysisService.java    # AI Skill Gap & Roadmap Synthesis Algorithm
│       │   │   └── exception/
│       │   │       └── GlobalExceptionHandler.java  # Structured JSON Error Handler
│       │   └── resources/
│       │       └── application.properties           # Database configuration, JWT settings, CORS
│       └── test/                                    # Unit & Integration Tests (12/12 Passing)
└── frontend/                     # Modern Responsive Glassmorphic SPA Frontend
    ├── index.html                # Landing Page (Stream Pathfinder, Track Catalog, Hero)
    ├── login.html                # Sign In (Demo credentials 1-click fill, JWT authentication)
    ├── register.html             # Student Registration (BCrypt hashed on backend)
    ├── careers.html              # Career Tracks Catalog & Filters (Salary, Demand, Stack)
    ├── profile.html              # 4-Stage Assessment Wizard with Categorized Skill Matrix
    ├── roadmap.html              # Dynamic Roadmap with SVG Score Gauge, Checklist & Live Sync
    ├── dashboard.html            # Student Dashboard (Real Persisted History & Stats)
    ├── resume-scanner.html       # AI Resume ATS Keyword Scanner
    ├── quiz.html                 # Technical Calibration Quiz
    ├── css/
    │   ├── style.css             # Watermelon Sorbet design tokens, typography, glass cards
    │   └── components.css        # Stepper wizard, timeline, checklists, gauges
    └── js/
        ├── auth.js               # Spring Security JWT authentication & route access guard
        ├── api.js                # REST API service layer with intelligence fallback
        ├── app.js                # UI behavior, toast notifications, dashboard history
        └── roadmap.js            # SVG circular gauge, topic checklist tracking & progress sync
```

---

## ⚡ Running Locally

### 1. Running the Backend (Spring Boot with Java 21)

Open a PowerShell terminal in the `backend` directory:

```powershell
$jdk = (Get-ChildItem "C:\Program Files\Eclipse Adoptium\" -Directory | Select-Object -First 1).FullName
$env:JAVA_HOME = $jdk
$env:Path = "$env:JAVA_HOME\bin;$env:Path"
.\mvnw.cmd spring-boot:run
```

- **Backend Base URL**: `http://localhost:8080`
- **Health Check**: `http://localhost:8080/api/health`
- **Career Catalog API**: `http://localhost:8080/api/careers`
- **Current User Context**: `GET http://localhost:8080/api/auth/me` (requires Bearer token)

### 2. Running Automated Tests

```powershell
$jdk = (Get-ChildItem "C:\Program Files\Eclipse Adoptium\" -Directory | Select-Object -First 1).FullName
$env:JAVA_HOME = $jdk
$env:Path = "$env:JAVA_HOME\bin;$env:Path"
.\mvnw.cmd test
```

**Results**: 12/12 Tests Passing (100% Success Rate).

---

### 3. Running the Frontend (Modern SPA)

Open a terminal in the `frontend` directory:

```powershell
cd frontend
npm run dev
```
Visit: **`http://localhost:5500`**

Or using Python / NPX:
```powershell
python -m http.server 5500
```

---

## 🔒 Security Architecture Highlights

1. **Spring Security Filter Chain**: Configured with stateless session policy (`SessionCreationPolicy.STATELESS`).
2. **BCrypt Password Hashing**: Passwords stored and verified securely via Spring Security's `BCryptPasswordEncoder`.
3. **HMAC-SHA256 JWT Authentication**: Real cryptographic signatures and expiration validation via `io.jsonwebtoken (JJWT 0.12.6)`.
4. **Context-Derived `/api/auth/me`**: User identity resolved exclusively from `SecurityContextHolder`, preventing user spoofing.
5. **Route Access Guards**: Protected pages (`profile.html`, `roadmap.html`, `resume-scanner.html`, `dashboard.html`) enforce login state before displaying student tools.
6. **Relational Persistence**: Real JPA persistence for assessment history (`AssessmentRecord`) eliminating memory leaks and fake state.

---

## 📡 REST API Reference

| Method | Endpoint | Authorization | Description |
|---|---|---|---|
| `GET` | `/api/health` | Public | Service health status and uptime |
| `POST` | `/api/auth/register` | Public | Register new student account (BCrypt hashed) |
| `POST` | `/api/auth/login` | Public | Authenticate user credentials and receive JWT |
| `GET` | `/api/auth/me` | Bearer Token | Fetch authenticated user profile from verified security context |
| `GET` | `/api/careers` | Public | Catalog of all benchmarked engineering roles |
| `GET` | `/api/careers/{id}` | Public | Detailed requirements for an individual career role |
| `POST` | `/api/students` | Bearer Token | Persist assessment & generate roadmap |
| `GET` | `/api/students/my-history` | Bearer Token | Retrieve authenticated student's saved assessment history |
| `POST` | `/api/students/update-progress` | Bearer Token | Sync completed milestone checklist progress |
| `POST` | `/api/analyze` | Public / Token | Real-time gap analysis without requiring database save |
