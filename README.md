# 🚀 SkillPath AI — Enterprise Java Full Stack Platform

> **Intelligent Career Navigation, Skill Gap Benchmarking & Milestone Roadmap Platform for Students**

SkillPath AI benchmarks student profiles (academic coursework, current skills, projects, CGPA, and career ambitions) against real-world industry requirements. It detects critical skill gaps, computes a quantitative market readiness score, and synthesizes a step-by-step milestone learning roadmap with interactive checklists, capstone blueprints, and certification guides.

---

## 📁 Project Architecture

The repository is cleanly separated into isolated, maintainable frontend and backend modules:

```text
SkillPath-AI/
├── .gitattributes                # Git line ending normalization
├── .gitignore                    # Root gitignore (Maven, Java, Node, IDE, OS)
├── README.md                     # Project documentation & terminal run guide
├── backend/                      # Spring Boot 4 Java Backend (Java 21)
│   ├── mvnw & mvnw.cmd           # Maven Wrapper
│   ├── pom.xml                   # Dependencies (Spring Web, JPA, MySQL, Validation)
│   ├── .mvn/                     # Maven wrapper configuration
│   └── src/
│       ├── main/
│       │   ├── java/com/skillpath/ai/
│       │   │   ├── SkillPathAiApplication.java
│       │   │   ├── controller/
│       │   │   │   ├── AuthController.java          # REST Auth (/api/auth/register, /api/auth/login, /api/auth/me)
│       │   │   │   ├── CareerRestController.java    # REST Careers (/api/careers, /api/careers/{id})
│       │   │   │   ├── StudentRestController.java   # REST Students (/api/students, /api/analyze, /api/health)
│       │   │   │   ├── StudentController.java       # Thymeleaf Form Handler (/profile)
│       │   │   │   └── HomeController.java          # Root Route (/)
│       │   │   ├── model/
│       │   │   │   ├── User.java                    # User Account Entity for Authentication
│       │   │   │   ├── Student.java                 # Student Profile JPA Entity
│       │   │   │   ├── CareerPath.java              # Industry Career Track Benchmark Model
│       │   │   │   ├── AnalysisResult.java          # Comprehensive Readiness Score & Gaps DTO
│       │   │   │   └── RoadmapStep.java             # Milestone Step Model with Topics
│       │   │   ├── repository/
│       │   │   │   ├── UserRepository.java          # Spring Data JPA User Repository
│       │   │   │   └── StudentRepository.java       # Spring Data JPA Student Repository
│       │   │   ├── service/
│       │   │   │   ├── CareerCatalogService.java    # Benchmark Catalog for 8+ Engineering Roles
│       │   │   │   └── SkillAnalysisService.java    # AI Skill Gap & Roadmap Synthesis Algorithm
│       │   │   └── exception/
│       │   │       └── GlobalExceptionHandler.java  # Structured JSON Error Handler
│       │   └── resources/
│       │       ├── application.properties           # Fail-safe database configuration & timeouts
│       │       └── templates/                       # Thymeleaf views (index, profile)
│       └── test/                                    # Unit & Integration Tests
└── frontend/                     # Modern Responsive Glassmorphic SPA Frontend
    ├── index.html                # Enterprise Landing Page (Stats, Pipeline, Role Explorer, Testimonials)
    ├── login.html                # Split-Layout Sign In (Demo credentials 1-click fill, password toggle)
    ├── register.html             # Split-Layout Registration (University & Major intake)
    ├── careers.html              # Career Tracks Catalog & Filters (Salary, Demand, Core Tech)
    ├── profile.html              # 4-Stage Assessment Wizard with Categorized Skill Matrix
    ├── roadmap.html              # Dynamic Roadmap with SVG Score Gauge, Checklist & PDF Export
    ├── dashboard.html            # Student Dashboard (Saved Roadmaps, Active Progress & Stats)
    ├── css/
    │   ├── style.css             # Design tokens, typography (Outfit & Jakarta Sans), 3D hover effects
    │   └── components.css        # Stepper wizard, timeline, checklists, glass cards, gauges
    └── js/
        ├── auth.js               # User authentication, session persistence & navbar state
        ├── api.js                # REST API service layer with intelligent client-side fallback
        ├── app.js                # UI behavior, toast notifications, interactive chip synchronization
        └── roadmap.js            # SVG circular score gauge, topic checklist tracking & PDF export
```

---

## ⚡ Terminal Run Commands

### 1. Running the Backend (Spring Boot)

Open a terminal in the root workspace directory (`SkillPath-AI`):

#### PowerShell (Windows):
```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

#### Command Prompt (CMD):
```cmd
cd backend
mvnw.cmd spring-boot:run
```

- **Backend URL**: `http://localhost:8080`
- **Health Check**: `http://localhost:8080/api/health`
- **Career Catalog API**: `http://localhost:8080/api/careers`
- **Registered Students API**: `http://localhost:8080/api/students`

> **Fail-Safe Database Engine**: `application.properties` is configured with fast fail-safe timeouts (`initialization-fail-timeout=0`). If your local MySQL service is stopped, the backend automatically utilizes an in-memory cache so all REST APIs and authentication continue running seamlessly!

---

### 2. Running the Frontend (Modern SPA)

Open a second terminal window:

#### Option A: Direct Browser Launch (Quickest)
```powershell
cd frontend
Start-Process index.html
```
*(Or double-click `frontend/index.html` in Windows File Explorer)*

#### Option B: Local Web Server (Recommended)
Using Node / NPM:
```powershell
cd frontend
npm run dev
```
*(Runs a lightweight server on `http://localhost:5500`)*

Using Python:
```powershell
cd frontend
python -m http.server 5500
```
Then visit: **`http://localhost:5500`**

Or direct NPX:
```powershell
npx -y serve frontend -l 5500
```


---

## 🌟 Complete Feature Map

| Page | Features & Capabilities |
|---|---|
| **Landing Page** (`index.html`) | Tech orbit hero, live stats counter (25+ tracks, 150+ skills), 3D card tilt hover effects, 4-step pipeline, student testimonials, and FAQ accordion. |
| **Sign In** (`login.html`) | Split-pane glass card, password visibility toggle, and **1-Click Demo Login** (`student@skillpath.ai` / `password123`). |
| **Register** (`register.html`) | Full academic profile creation (University, Department, Academic Year, Role). |
| **Career Tracks** (`careers.html`) | Searchable catalog of 8+ high-demand tech pathways with salary brackets, hiring demand ratings, core skills, and direct roadmap launcher. |
| **Assessment Wizard** (`profile.html`) | 4-stage stepper wizard with categorized skill matrix (Languages, Frameworks, Databases, Tools) and live match estimation. |
| **Interactive Roadmap** (`roadmap.html`) | Animated circular SVG readiness gauge, side-by-side gap analysis, 4-phase learning milestones with **interactive topic checkboxes** that update your score live, capstone project blueprints, and PDF export. |
| **Dashboard** (`dashboard.html`) | Student overview with active readiness score, verified skills, and history of saved roadmaps with 1-click loading. |

---

## 📡 REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health status and version info |
| `POST` | `/api/auth/register` | Register new student or mentor account |
| `POST` | `/api/auth/login` | Authenticate user credentials and return session token |
| `GET` | `/api/auth/me` | Fetch currently authenticated user profile |
| `GET` | `/api/careers` | Catalog of all benchmarked engineering roles |
| `GET` | `/api/careers/{id}` | Detailed requirements for an individual career role |
| `POST` | `/api/students` | Persist student profile & synthesize full skill gap roadmap |
| `GET` | `/api/students` | List all registered student profiles |
| `GET` | `/api/students/{id}` | Retrieve student profile and roadmap by ID |
| `POST` | `/api/analyze` | On-the-fly gap analysis without requiring database persistence |
