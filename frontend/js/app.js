/**
 * SkillPath-AI Frontend Core Logic & Interactive Showcase
 * Handles interactive skill selection, profile submission, hero simulator, and branch calculator
 */

document.addEventListener('DOMContentLoaded', () => {
  updateBackendStatusBadge();
  setupSkillChips();
  setupProfileForm();
  setupQuickPreview();
  setupHeroSimulator();
  setupBranchCalculator();
  setupDashboardPage();
  setupSkillQuiz();
  setupResumeScanner();
});

// Live Server Connectivity Indicator
async function updateBackendStatusBadge() {
  const badge = document.getElementById('backendStatusBadge');
  if (!badge) return;

  try {
    if (typeof SkillPathAPI !== 'undefined' && SkillPathAPI.checkHealth) {
      const health = await SkillPathAPI.checkHealth();
      if (health && health.status === 'UP') {
        badge.innerHTML = `<span class="status-indicator online" style="background: #10B981; box-shadow: 0 0 10px #10B981; width: 8px; height: 8px; border-radius: 50%; display: inline-block;"></span> Spring Boot 4 Active`;
        badge.style.borderColor = 'rgba(16, 185, 129, 0.4)';
        badge.style.color = '#34D399';
        return;
      }
    }
  } catch (e) {}

  badge.innerHTML = `<span class="status-indicator simulated" style="background: var(--color-amber); box-shadow: 0 0 10px var(--color-amber); width: 8px; height: 8px; border-radius: 50%; display: inline-block;"></span> Offline Engine Ready`;
  badge.style.borderColor = 'var(--border-subtle)';
  badge.style.color = 'var(--color-amber-light)';
}

// Toast notification helper
function showToast(message, type = 'info') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// Interactive skill chip toggle in Assessment Form
function setupSkillChips() {
  const chips = document.querySelectorAll('.skill-chip');
  const skillsInput = document.getElementById('skillsInput');
  if (!skillsInput || !chips.length) return;

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const skillName = chip.getAttribute('data-skill') || chip.textContent.trim();
      let currentSkills = skillsInput.value
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      const index = currentSkills.findIndex(s => s.toLowerCase() === skillName.toLowerCase());

      if (index >= 0) {
        currentSkills.splice(index, 1);
        chip.classList.remove('selected');
      } else {
        currentSkills.push(skillName);
        chip.classList.add('selected');
      }

      skillsInput.value = currentSkills.join(', ');
    });
  });

  // Sync chip active state if textarea manually edited
  skillsInput.addEventListener('input', () => {
    const entered = skillsInput.value.toLowerCase();
    chips.forEach(chip => {
      const skillName = (chip.getAttribute('data-skill') || chip.textContent).toLowerCase().trim();
      if (entered.includes(skillName)) {
        chip.classList.add('selected');
      } else {
        chip.classList.remove('selected');
      }
    });
  });
}

// Form Submission handling
function setupProfileForm() {
  const form = document.getElementById('studentProfileForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg class="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;">
        <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
        <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
      </svg>
      Analyzing with SkillPath AI...
    `;

    const formData = new FormData(form);
    const studentData = {
      name: formData.get('name'),
      email: formData.get('email'),
      branch: formData.get('branch'),
      year: formData.get('year'),
      cgpa: parseFloat(formData.get('cgpa')) || 0,
      skills: formData.get('skills') || '',
      interests: formData.get('interests') || '',
      projects: formData.get('projects') || '',
      certifications: formData.get('certifications') || '',
      careerGoal: formData.get('careerGoal')
    };

    try {
      showToast('Synthesizing personalized AI skill roadmap...', 'info');
      const analysisResult = await SkillPathAPI.registerStudent(studentData);

      // Store in sessionStorage to display on roadmap.html
      sessionStorage.setItem('currentAnalysis', JSON.stringify(analysisResult));
      showToast('Profile analyzed and registered successfully!', 'success');

      setTimeout(() => {
        window.location.href = 'roadmap.html';
      }, 700);

    } catch (err) {
      console.error('Submission failed:', err);
      showToast('Could not process profile. Please check console.', 'error');
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });
}

// Quick live preview when choosing career goal
function setupQuickPreview() {
  const careerSelect = document.getElementById('careerGoalSelect');
  const previewBox = document.getElementById('careerPreviewBox');
  if (!careerSelect || !previewBox) return;

  careerSelect.addEventListener('change', () => {
    const val = careerSelect.value;
    if (!val) {
      previewBox.style.display = 'none';
      return;
    }
    previewBox.style.display = 'block';
  });
}

// ========================================================
// Interactive Hero AI Skill Simulator
// ========================================================
const SIMULATOR_DATA = {
  java: {
    title: 'Java Cloud Architect',
    icon: '☕',
    category: 'Enterprise Microservices & Cloud Systems',
    desc: 'Architect high-concurrency Spring Boot microservices, resilient distributed databases, and Dockerized cloud clusters.',
    match: 88,
    salary: 'Avg: $115K / ₹14-24 LPA',
    roleParam: 'Software Developer',
    mastered: ['Core Java 21', 'OOP & Design Patterns', 'SQL & Relational Schema', 'Data Structures & Algorithms'],
    gaps: ['Spring Boot 4 REST APIs', 'Spring Security & JWT', 'Docker Containerization', 'Kafka Message Queues'],
    timeline: [
      { badge: 'Weeks 1-4', text: 'Advanced Java 21, Concurrency, JPA/Hibernate & Spring Boot Core' },
      { badge: 'Weeks 5-8', text: 'JWT Authentication, Stateless Security Filters & REST API Best Practices' },
      { badge: 'Weeks 9-16', text: 'Docker Multi-Stage Deployments, PostgreSQL Cloud Scaling & Microservices' }
    ]
  },
  aiml: {
    title: 'AI & Machine Learning Engineer',
    icon: '🤖',
    category: 'Deep Learning, LLMs & Neural Networks',
    desc: 'Build neural network architectures, fine-tune open weights LLMs, and deploy production inference pipelines.',
    match: 92,
    salary: 'Avg: $130K / ₹18-35 LPA',
    roleParam: 'AI / ML Engineer',
    mastered: ['Python 3.12', 'Linear Algebra & Calculus', 'Data Analysis (Pandas/Numpy)', 'Probability & Statistics'],
    gaps: ['PyTorch / Transformers', 'Vector Embeddings & RAG', 'MLOps & Model Serving', 'CUDA GPU Acceleration'],
    timeline: [
      { badge: 'Weeks 1-4', text: 'PyTorch Deep Learning Foundations, Backprop & CNN/Transformer Core' },
      { badge: 'Weeks 5-8', text: 'Attention Mechanisms, HuggingFace Hub & Fine-Tuning Open Source LLMs' },
      { badge: 'Weeks 9-20', text: 'Vector DBs (Pinecone/Milvus), RAG Pipelines & FastAPI Model Endpoints' }
    ]
  },
  devops: {
    title: 'Cloud & DevOps SRE',
    icon: '☁️',
    category: 'Platform Infrastructure & Cloud Native',
    desc: 'Automate scalable cloud infrastructure, maintain zero-downtime CI/CD pipelines, and orchestrate containers.',
    match: 84,
    salary: 'Avg: $125K / ₹15-30 LPA',
    roleParam: 'Cloud Engineer',
    mastered: ['Linux Shell & Bash Scripting', 'TCP/IP Networking Fundamentals', 'Git Version Control', 'Basic Docker'],
    gaps: ['Kubernetes (K8s Cluster Ops)', 'Terraform (IaC Automation)', 'AWS Cloud Architecture', 'Prometheus & Grafana'],
    timeline: [
      { badge: 'Weeks 1-4', text: 'Linux Internals, Advanced Docker Multi-Stage Composes & Networking' },
      { badge: 'Weeks 5-8', text: 'Kubernetes Cluster Architecture, Pods, Services, Ingress & Helm' },
      { badge: 'Weeks 9-18', text: 'Terraform Infrastructure as Code, GitHub Actions CI/CD & Observability' }
    ]
  },
  fullstack: {
    title: 'Full Stack Engineer (MERN/Next.js)',
    icon: '⚛️',
    category: 'Modern Web Apps & Reactive Platforms',
    desc: 'Develop responsive Single Page Applications, reactive server components, and performant REST/GraphQL backends.',
    match: 94,
    salary: 'Avg: $110K / ₹12-22 LPA',
    roleParam: 'Full Stack Developer',
    mastered: ['HTML5 & Modern CSS', 'Modern JavaScript (ES6+)', 'React 19 Components', 'Basic REST API Consumption'],
    gaps: ['TypeScript 5 Strict Typing', 'Next.js App Router', 'State Management (Zustand)', 'PostgreSQL / Prisma ORM'],
    timeline: [
      { badge: 'Weeks 1-4', text: 'Modern TypeScript, React 19 Hooks, Server Components & TailwindCSS' },
      { badge: 'Weeks 5-8', text: 'Next.js App Router, Server Actions, Authentication & Prisma ORM' },
      { badge: 'Weeks 9-16', text: 'Full-Stack SaaS Capstone with Cloud Deployment & Payments' }
    ]
  },
  cyber: {
    title: 'Cybersecurity Analyst',
    icon: '🛡️',
    category: 'Information Security & Threat Defense',
    desc: 'Identify vulnerabilities, secure enterprise networks, conduct penetration testing, and configure firewalls.',
    match: 81,
    salary: 'Avg: $112K / ₹14-26 LPA',
    roleParam: 'Cybersecurity Analyst',
    mastered: ['TCP/IP & OSI Model', 'Operating Systems Concepts', 'Python Security Scripting', 'Cryptography Basics'],
    gaps: ['OWASP Top 10 Vulnerabilities', 'Network Penetration Testing', 'SIEM (Splunk/Elastic)', 'SOC Incident Response'],
    timeline: [
      { badge: 'Weeks 1-4', text: 'Network Packet Analysis (Wireshark), Port Scanning (Nmap) & OS Hardening' },
      { badge: 'Weeks 5-8', text: 'Web Security Vulnerabilities (OWASP), Burp Suite & API Penetration' },
      { badge: 'Weeks 9-16', text: 'SOC Operations, Log Analysis, Security Information & Event Management (SIEM)' }
    ]
  }
};

function setupHeroSimulator() {
  const tabsContainer = document.getElementById('simulatorTabs');
  if (!tabsContainer) return;

  const buttons = tabsContainer.querySelectorAll('.sim-tab-btn');

  function renderRole(key) {
    const data = SIMULATOR_DATA[key];
    if (!data) return;

    // Update active tab
    buttons.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-role') === key);
    });

    // Update left panel
    const iconEl = document.getElementById('simRoleIcon');
    const titleEl = document.getElementById('simRoleTitle');
    const catEl = document.getElementById('simRoleCategory');
    const descEl = document.getElementById('simRoleDesc');
    const gaugeCircle = document.getElementById('simGaugeCircle');
    const gaugeText = document.getElementById('simGaugeText');
    const salaryTag = document.getElementById('simSalaryTag');
    const ctaBtn = document.getElementById('simCtaBtn');

    if (iconEl) iconEl.textContent = data.icon;
    if (titleEl) titleEl.textContent = data.title;
    if (catEl) catEl.textContent = data.category;
    if (descEl) descEl.textContent = data.desc;
    if (salaryTag) salaryTag.textContent = data.salary;
    if (ctaBtn) ctaBtn.href = `profile.html?role=${encodeURIComponent(data.roleParam)}`;

    if (gaugeText) gaugeText.textContent = `${data.match}%`;
    if (gaugeCircle) {
      // 2 * PI * r = 2 * 3.14159 * 35 = 219.9
      const totalCircumference = 219.9;
      const offset = totalCircumference - (data.match / 100) * totalCircumference;
      gaugeCircle.style.strokeDashoffset = offset;
    }

    // Update right panel mastered skills
    const masteredEl = document.getElementById('simMasteredSkills');
    if (masteredEl) {
      masteredEl.innerHTML = data.mastered
        .map(skill => `<span class="chip-mastered">✓ ${skill}</span>`)
        .join('');
    }

    // Update right panel gap skills
    const gapsEl = document.getElementById('simGapSkills');
    if (gapsEl) {
      gapsEl.innerHTML = data.gaps
        .map(skill => `<span class="chip-gap">⚠️ ${skill}</span>`)
        .join('');
    }

    // Update timeline
    const timelineEl = document.getElementById('simTimeline');
    if (timelineEl) {
      timelineEl.innerHTML = data.timeline
        .map(step => `
          <div class="mini-step-item">
            <span class="mini-step-badge">${step.badge}</span>
            <span>${step.text}</span>
          </div>
        `)
        .join('');
    }
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const roleKey = btn.getAttribute('data-role');
      renderRole(roleKey);
    });
  });

  // Initial trigger
  renderRole('java');
}

// ========================================================
// Interactive University Branch Gap Calculator
// ========================================================
const BRANCH_DATA = {
  cse: {
    title: 'Computer Science & Engineering (CSE / IT)',
    icon: '💻',
    strengths: 'Strong foundations in Object-Oriented Programming (C++/Java), Relational Database Theory, Operating Systems & Data Structures.',
    blindspots: 'Classroom curriculum often misses industry-standard Spring Boot microservices, Dockerization, cloud hosting, and production CI/CD pipelines.',
    strategy: 'Skip syntax fundamentals and accelerate immediately into enterprise REST architecture, JWT security, and scalable cloud microservice capstones.',
    topMatches: ['Java Cloud Architect', 'Full Stack Engineer', 'AI/ML Specialist'],
    readinessBoost: '+45% Employability in 16 Weeks'
  },
  ece: {
    title: 'Electronics & Communication Engineering (ECE)',
    icon: '⚡',
    strengths: 'Superb mathematical grounding, digital logic understanding, microcontrollers, and hardware/memory-level awareness.',
    blindspots: 'Limited coursework in enterprise Web technologies, design patterns, high-concurrency SQL optimization, and distributed systems.',
    strategy: 'Capitalize on low-level memory efficiency for Cloud Infrastructure, SRE, or Embedded Cloud Systems with a focused 16-week OOP bridge.',
    topMatches: ['Cloud & DevOps SRE', 'Embedded Systems Engineer', 'Backend Developer'],
    readinessBoost: '+60% Employability in 18 Weeks'
  },
  mech: {
    title: 'Mechanical & Civil Engineering',
    icon: '⚙️',
    strengths: 'Exceptional analytical modeling, physics simulation acumen, structural problem-solving, and methodical engineering thinking.',
    blindspots: 'Algorithms, computational complexity (Big-O), code version control with Git, and web technologies.',
    strategy: 'Follow our specialized Non-CS Conversion track: master Python & Java syntax in weeks 1-4, then build portfolio projects in Full Stack Web or Data Analytics.',
    topMatches: ['Data Analyst / BI', 'Full Stack Developer', 'Automation QA Engineer'],
    readinessBoost: '+70% Employability in 20 Weeks'
  },
  bca: {
    title: 'BCA / MCA Candidates',
    icon: '🎓',
    strengths: 'Practical application coding experience, familiarity with HTML/CSS/JS, PHP/Java, and desktop application concepts.',
    blindspots: 'System design depth, concurrency internals, memory caching with Redis, and containerized microservice architectures.',
    strategy: 'Fortify system design and algorithms while constructing production-ready cloud applications that pass Tier-1 technical interviews.',
    topMatches: ['Full Stack Engineer', 'Java Backend Developer', 'Cloud Administrator'],
    readinessBoost: '+50% Employability in 16 Weeks'
  },
  other: {
    title: 'Non-Tech & Career Transitioners',
    icon: '🌐',
    strengths: 'Valuable domain expertise, critical business thinking, user empathy, and fresh real-world perspectives.',
    blindspots: 'Software engineering concepts, terminal command line, version control, and algorithmic logic.',
    strategy: 'Start with visual interactive programming fundamentals, transition into responsive Frontend Web development, and deploy a showcase portfolio.',
    topMatches: ['Frontend UI Developer', 'Product Analyst', 'QA Automation Engineer'],
    readinessBoost: '+65% Employability in 22 Weeks'
  }
};

function setupBranchCalculator() {
  const container = document.getElementById('branchSelectorGroup');
  const insightBox = document.getElementById('branchInsightBox');
  if (!container || !insightBox) return;

  const buttons = container.querySelectorAll('.branch-btn');

  function renderBranch(key) {
    const data = BRANCH_DATA[key];
    if (!data) return;

    buttons.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-branch') === key);
    });

    insightBox.innerHTML = `
      <div>
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
          <span style="font-size: 2rem;">${data.icon}</span>
          <div>
            <h3 style="font-size: 1.35rem; margin-bottom: 2px;">${data.title}</h3>
            <span style="color: var(--accent-emerald); font-weight: 700; font-size: 0.85rem;">${data.readinessBoost}</span>
          </div>
        </div>
        <p style="color: #cbd5e1; font-size: 0.95rem; margin-bottom: 14px; line-height: 1.6;">
          <strong style="color: #34d399;">Academic Advantage:</strong> ${data.strengths}
        </p>
        <p style="color: #cbd5e1; font-size: 0.95rem; line-height: 1.6;">
          <strong style="color: #fcd34d;">Curriculum Blindspot:</strong> ${data.blindspots}
        </p>
      </div>

      <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: var(--radius-md); padding: 22px;">
        <h4 style="font-size: 1rem; margin-bottom: 8px; color: var(--accent-cyan);">SkillPath Transformation Blueprint</h4>
        <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 16px; line-height: 1.6;">
          ${data.strategy}
        </p>
        <div style="margin-bottom: 16px;">
          <span style="font-size: 0.8rem; text-transform: uppercase; color: var(--text-dim); font-weight: 700; display: block; margin-bottom: 8px;">Top Role Matches:</span>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            ${data.topMatches.map(m => `<span class="chip-mastered" style="color: #93c5fd; border-color: rgba(147, 197, 253, 0.3); background: rgba(59, 130, 246, 0.1);">${m}</span>`).join('')}
          </div>
        </div>
        <a href="profile.html?branch=${encodeURIComponent(key.toUpperCase())}" class="btn btn-outline btn-sm" style="width: 100%; justify-content: center;">
          Generate My Tailored ${key.toUpperCase()} Roadmap →
        </a>
      </div>
    `;
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      renderBranch(btn.getAttribute('data-branch'));
    });
  });

  renderBranch('cse');
}

// ========================================================
// Student Dashboard Controller (dashboard.html)
// ========================================================
async function setupDashboardPage() {
  const dashNameEl = document.getElementById('dashStudentName');
  if (!dashNameEl) return;

  const user = typeof AuthService !== 'undefined' ? AuthService.getUser() : null;
  const token = typeof AuthService !== 'undefined' ? AuthService.getToken() : null;

  if (user) {
    const avatarEl = document.getElementById('dashAvatar');
    if (avatarEl) {
      const initials = (user.name || 'Student')
        .split(' ')
        .map(n => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
      avatarEl.textContent = initials || 'SP';
    }
    dashNameEl.textContent = `${user.name || 'Student'}'s Dashboard`;

    const metaEl = document.getElementById('dashStudentMeta');
    if (metaEl) {
      const univ = user.university || 'Tech University';
      const branch = user.branch || 'Engineering';
      const year = user.year || '3rd Year';
      metaEl.textContent = `${univ} • ${branch} • ${year}`;
    }
  }

  const tableBody = document.getElementById('savedRoadmapsTableBody');
  const targetRoleEl = document.getElementById('dashTargetRole');
  const scoreEl = document.getElementById('dashScore');
  const acquiredEl = document.getElementById('dashAcquiredCount');
  const gapsEl = document.getElementById('dashGapsCount');

  // Try fetching backend assessment history
  let history = [];
  if (token) {
    try {
      const targetApi = typeof API_BASE_URL !== 'undefined' ? API_BASE_URL : 'http://localhost:8080/api';
      const res = await fetch(`${targetApi}/students/my-history`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      if (res.ok) {
        history = await res.json();
      }
    } catch (e) {
      console.warn('Could not fetch assessment history from API:', e);
    }
  }

  // Fallback to locally stored currentAnalysis if no backend history
  if (!history || history.length === 0) {
    const local = sessionStorage.getItem('currentAnalysis') || localStorage.getItem('lastAnalysis');
    if (local) {
      try {
        const parsed = JSON.parse(local);
        history = [{
          id: parsed.recordId || parsed.student?.id || 1,
          careerGoal: parsed.careerGoal || 'Software Developer',
          createdAt: new Date().toISOString(),
          readinessScore: parsed.readinessScore || 75,
          acquiredSkills: (parsed.acquiredSkills || []).join(', '),
          missingSkills: (parsed.missingSkills || []).join(', '),
          summary: parsed.summary || 'Roadmap synthesized with milestone checkpoints.',
          rawAnalysis: parsed
        }];
      } catch (e) {}
    }
  }

  if (history && history.length > 0) {
    const latest = history[0];
    if (targetRoleEl) targetRoleEl.textContent = latest.careerGoal || 'Software Developer';
    if (scoreEl) scoreEl.textContent = `${latest.readinessScore || 0}%`;

    const acquiredCount = latest.acquiredSkills ? latest.acquiredSkills.split(',').filter(Boolean).length : 0;
    const gapsCount = latest.missingSkills ? latest.missingSkills.split(',').filter(Boolean).length : 0;

    if (acquiredEl) acquiredEl.textContent = `${acquiredCount} Skills`;
    if (gapsEl) gapsEl.textContent = `${gapsCount} Gaps`;

    if (tableBody) {
      tableBody.innerHTML = history.map((item, idx) => {
        const dateStr = item.createdAt ? new Date(item.createdAt).toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }) : 'Recently';

        return `
          <tr style="border-bottom: 1px solid var(--border-subtle); transition: var(--transition);">
            <td style="padding: 16px;">
              <strong style="color: var(--text-main); font-size: 0.98rem; display: block;">${item.careerGoal || 'Engineering Track'}</strong>
              <span style="font-size: 0.8rem; color: var(--text-dim);">${item.branch || 'Engineering'} • ${item.year || 'Student'}</span>
            </td>
            <td style="padding: 16px; color: var(--text-muted); font-size: 0.88rem;">${dateStr}</td>
            <td style="padding: 16px;">
              <span style="padding: 4px 10px; border-radius: 9999px; background: rgba(238, 162, 67, 0.15); border: 1px solid rgba(238, 162, 67, 0.4); color: var(--color-amber-light); font-weight: 800; font-size: 0.82rem;">
                ${item.readinessScore || 0}% Ready
              </span>
            </td>
            <td style="padding: 16px; font-size: 0.86rem; color: var(--text-muted); max-width: 280px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
              ${item.summary || (item.acquiredSkills ? item.acquiredSkills.slice(0, 50) + '...' : 'Interactive Sprint Roadmap')}
            </td>
            <td style="padding: 16px; text-align: right; white-space: nowrap;">
              <button class="btn btn-primary btn-sm resume-roadmap-btn" data-index="${idx}" style="padding: 6px 14px; font-size: 0.82rem;">
                Open Roadmap ↗
              </button>
            </td>
          </tr>
        `;
      }).join('');

      tableBody.querySelectorAll('.resume-roadmap-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.getAttribute('data-index'), 10);
          const chosen = history[idx];
          if (chosen) {
            if (chosen.rawAnalysis) {
              sessionStorage.setItem('currentAnalysis', JSON.stringify(chosen.rawAnalysis));
            } else {
              const reconstructed = {
                recordId: chosen.id,
                careerGoal: chosen.careerGoal,
                readinessScore: chosen.readinessScore,
                acquiredSkills: chosen.acquiredSkills ? chosen.acquiredSkills.split(',').map(s => s.trim()) : [],
                missingSkills: chosen.missingSkills ? chosen.missingSkills.split(',').map(s => s.trim()) : [],
                summary: chosen.summary,
                student: {
                  name: user ? user.name : 'Student',
                  branch: chosen.branch || 'Engineering',
                  year: chosen.year || '3rd Year',
                  cgpa: chosen.cgpa || 8.5
                }
              };
              sessionStorage.setItem('currentAnalysis', JSON.stringify(reconstructed));
            }
            window.location.href = 'roadmap.html';
          }
        });
      });
    }
  } else {
    if (tableBody) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align: center; padding: 50px 20px; color: var(--text-muted);">
            <div style="font-size: 2.2rem; margin-bottom: 10px;">📋</div>
            <h4 style="font-size: 1.15rem; color: var(--text-main); margin-bottom: 6px;">No Saved Roadmaps Found</h4>
            <p style="font-size: 0.9rem; margin-bottom: 18px;">You haven't run any career skill evaluations yet.</p>
            <a href="profile.html" class="btn btn-primary btn-sm">Launch Your First Assessment →</a>
          </td>
        </tr>
      `;
    }
  }
}

// ========================================================
// Foundational Skill Calibration Quiz (quiz.html)
// ========================================================
const QUIZ_QUESTIONS = [
  {
    topic: 'Data Structures & Algorithms',
    question: 'Which data structure offers average O(1) time complexity for lookup, insertion, and deletion operations?',
    options: [
      'Hash Table / HashMap',
      'Binary Search Tree (BST)',
      'Doubly Linked List',
      'Min-Heap'
    ],
    answer: 0,
    skill: 'Hash Tables & DSA',
    explanation: 'A Hash Table uses a hash function to map keys to bucket indices, providing average O(1) constant-time operations for lookups, inserts, and deletes.'
  },
  {
    topic: 'Databases & Transactions',
    question: 'In relational database theory (ACID), what does the "I" guarantee?',
    options: [
      'Immediate persistence to physical disk',
      'Isolation — Concurrent transactions execute without cross-interference',
      'Immutability — Historical rows can never be altered',
      'Indexing — Automatic B-Tree indexing on primary keys'
    ],
    answer: 1,
    skill: 'ACID Relational Databases',
    explanation: 'Isolation ensures that concurrently executing transactions cannot see or interfere with each other\'s uncommitted data, preventing race conditions.'
  },
  {
    topic: 'Web Architecture & REST APIs',
    question: 'According to RFC specifications, which HTTP response code correctly indicates that a new resource was successfully created on the server?',
    options: [
      '200 OK',
      '201 Created',
      '204 No Content',
      '304 Not Modified'
    ],
    answer: 1,
    skill: 'RESTful API Standards',
    explanation: 'HTTP 201 Created explicitly indicates that the request succeeded and resulted in the server creating a new resource, commonly accompanied by a Location header.'
  },
  {
    topic: 'Containerization & Cloud Native',
    question: 'What is the primary architectural advantage of using multi-stage Docker builds?',
    options: [
      'Minimizes final production container size by discarding compilers and build-time tools',
      'Permits running Windows and Linux containers simultaneously in one image',
      'Eliminates the need for Kubernetes cluster pods',
      'Enables automated DNS load balancing across containers'
    ],
    answer: 0,
    skill: 'Docker & Container Optimization',
    explanation: 'Multi-stage Docker builds allow you to use large SDKs and build tools in early stages, then copy only the finalized binary/jar into a slim runtime image (e.g. Alpine/Distroless), shrinking attack surface and image size.'
  },
  {
    topic: 'System Design & Resilience',
    question: 'Which design pattern prevents a microservice from endlessly calling a failing downstream dependency and exhausting system threads?',
    options: [
      'Circuit Breaker Pattern',
      'Busy-Waiting Polling Pattern',
      'Singleton Pattern',
      'Database Sharding'
    ],
    answer: 0,
    skill: 'Resilient Microservices Architecture',
    explanation: 'The Circuit Breaker pattern (popularized by Netflix Hystrix / Resilience4j) trips open when failure thresholds are reached, failing fast and allowing the downstream service time to recover.'
  }
];

function setupSkillQuiz() {
  const container = document.getElementById('skillQuizContainer');
  if (!container) return;

  let currentQuestionIndex = 0;
  const userAnswers = new Array(QUIZ_QUESTIONS.length).fill(null);
  let isSubmitted = false;

  function renderQuiz() {
    if (isSubmitted) {
      renderQuizResults();
      return;
    }

    const q = QUIZ_QUESTIONS[currentQuestionIndex];
    const total = QUIZ_QUESTIONS.length;
    const progressPercent = Math.round(((currentQuestionIndex + 1) / total) * 100);

    container.innerHTML = `
      <div class="glass-card" style="padding: 36px; border: 1.5px solid var(--border-bright); box-shadow: var(--shadow-lg);">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; flex-wrap: wrap; gap: 10px;">
          <span style="font-size: 0.8rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-amber-light); background: rgba(238, 162, 67, 0.12); padding: 4px 12px; border-radius: 9999px; border: 1px solid var(--border-subtle);">
            ${q.topic}
          </span>
          <span style="font-size: 0.88rem; color: var(--text-dim); font-weight: 700;">
            Question ${currentQuestionIndex + 1} of ${total}
          </span>
        </div>

        <!-- Progress Bar -->
        <div style="height: 6px; background: rgba(255, 255, 255, 0.08); border-radius: 9999px; margin-bottom: 26px; overflow: hidden;">
          <div style="height: 100%; width: ${progressPercent}%; background: var(--gradient-primary); transition: width 0.3s ease;"></div>
        </div>

        <h3 style="font-size: 1.35rem; line-height: 1.4; margin-bottom: 24px; color: var(--text-main);">
          ${q.question}
        </h3>

        <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 30px;">
          ${q.options.map((opt, optIdx) => {
            const isSelected = userAnswers[currentQuestionIndex] === optIdx;
            return `
              <button type="button" class="quiz-option-btn ${isSelected ? 'selected' : ''}" data-idx="${optIdx}" style="
                text-align: left;
                padding: 16px 20px;
                border-radius: var(--radius-sm);
                background: ${isSelected ? 'rgba(238, 162, 67, 0.16)' : 'rgba(255, 255, 255, 0.03)'};
                border: 1.5px solid ${isSelected ? 'var(--color-amber)' : 'var(--border-subtle)'};
                color: ${isSelected ? 'var(--color-cream)' : 'var(--text-muted)'};
                font-size: 0.96rem;
                cursor: pointer;
                transition: var(--transition);
                display: flex;
                align-items: center;
                gap: 14px;
              ">
                <span style="
                  width: 26px;
                  height: 26px;
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-weight: 800;
                  font-size: 0.82rem;
                  background: ${isSelected ? 'var(--color-amber)' : 'rgba(255, 255, 255, 0.08)'};
                  color: ${isSelected ? '#19100B' : 'var(--text-dim)'};
                  flex-shrink: 0;
                ">
                  ${String.fromCharCode(65 + optIdx)}
                </span>
                <span>${opt}</span>
              </button>
            `;
          }).join('')}
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-subtle); padding-top: 22px;">
          <button type="button" id="quizPrevBtn" class="btn btn-outline btn-sm" ${currentQuestionIndex === 0 ? 'disabled style="opacity: 0.4; cursor: not-allowed;"' : ''}>
            ← Previous
          </button>
          
          ${currentQuestionIndex === total - 1 ? `
            <button type="button" id="quizSubmitBtn" class="btn btn-primary" style="padding: 10px 24px;">
              Submit Calibration ⚡
            </button>
          ` : `
            <button type="button" id="quizNextBtn" class="btn btn-primary btn-sm" style="padding: 8px 22px;">
              Next Question →
            </button>
          `}
        </div>
      </div>
    `;

    container.querySelectorAll('.quiz-option-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-idx'), 10);
        userAnswers[currentQuestionIndex] = idx;
        renderQuiz();
      });
    });

    const prevBtn = document.getElementById('quizPrevBtn');
    if (prevBtn && currentQuestionIndex > 0) {
      prevBtn.addEventListener('click', () => {
        currentQuestionIndex--;
        renderQuiz();
      });
    }

    const nextBtn = document.getElementById('quizNextBtn');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (userAnswers[currentQuestionIndex] === null) {
          showToast('Please select an option before proceeding.', 'info');
          return;
        }
        currentQuestionIndex++;
        renderQuiz();
      });
    }

    const submitBtn = document.getElementById('quizSubmitBtn');
    if (submitBtn) {
      submitBtn.addEventListener('click', () => {
        if (userAnswers[currentQuestionIndex] === null) {
          showToast('Please select an answer for the final question.', 'info');
          return;
        }
        isSubmitted = true;
        renderQuiz();
      });
    }
  }

  function renderQuizResults() {
    let correctCount = 0;
    const verifiedBadges = [];
    const gapsFound = [];

    QUIZ_QUESTIONS.forEach((q, i) => {
      if (userAnswers[i] === q.answer) {
        correctCount++;
        verifiedBadges.push(q.skill);
      } else {
        gapsFound.push(q.skill);
      }
    });

    const percentage = Math.round((correctCount / QUIZ_QUESTIONS.length) * 100);

    // Save verified skills to session
    sessionStorage.setItem('quizVerifiedSkills', JSON.stringify(verifiedBadges));

    container.innerHTML = `
      <div class="glass-card" style="padding: 40px; border: 1.5px solid var(--border-bright); box-shadow: var(--shadow-lg); text-align: center;">
        
        <div style="width: 100px; height: 100px; border-radius: 50%; background: linear-gradient(135deg, rgba(212, 93, 28, 0.2) 0%, rgba(238, 162, 67, 0.2) 100%); border: 3px solid var(--color-amber); display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
          <span style="font-size: 2.2rem; font-weight: 900; font-family: 'Outfit', sans-serif; color: var(--color-cream);">${percentage}%</span>
        </div>

        <h2 style="font-size: 1.9rem; margin-bottom: 8px; color: var(--text-main);">
          ${percentage >= 80 ? 'Mastery Calibrated!' : percentage >= 60 ? 'Strong Foundational Knowledge' : 'Core Foundational Gaps Identified'}
        </h2>
        <p style="color: var(--text-muted); font-size: 1rem; max-width: 580px; margin: 0 auto 30px;">
          You answered ${correctCount} of ${QUIZ_QUESTIONS.length} questions correctly. Your calibrated competencies are ready to merge into your personal roadmap.
        </p>

        <!-- Badges Breakdown -->
        <div class="grid-2" style="text-align: left; margin-bottom: 35px; gap: 20px;">
          <div style="background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: var(--radius-md); padding: 20px;">
            <div style="font-size: 0.85rem; font-weight: 800; color: #34d399; margin-bottom: 12px; text-transform: uppercase;">
              ✓ Verified Skills (${verifiedBadges.length})
            </div>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              ${verifiedBadges.length > 0 ? verifiedBadges.map(s => `
                <div style="display: flex; align-items: center; gap: 8px; font-size: 0.92rem; color: var(--color-cream);">
                  <span style="color: #34d399; font-weight: 800;">✓</span> ${s}
                </div>
              `).join('') : '<span style="font-size: 0.88rem; color: var(--text-dim);">No competencies calibrated above threshold yet.</span>'}
            </div>
          </div>

          <div style="background: rgba(212, 93, 28, 0.08); border: 1px solid rgba(212, 93, 28, 0.3); border-radius: var(--radius-md); padding: 20px;">
            <div style="font-size: 0.85rem; font-weight: 800; color: var(--color-amber-light); margin-bottom: 12px; text-transform: uppercase;">
              ⚠️ Focus Gaps to Bridge (${gapsFound.length})
            </div>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              ${gapsFound.length > 0 ? gapsFound.map(s => `
                <div style="display: flex; align-items: center; gap: 8px; font-size: 0.92rem; color: var(--text-muted);">
                  <span style="color: var(--color-terracotta);">•</span> ${s}
                </div>
              `).join('') : '<span style="font-size: 0.88rem; color: #34d399;">Zero fundamental gaps detected! Outstanding work.</span>'}
            </div>
          </div>
        </div>

        <!-- Detailed Review -->
        <div style="text-align: left; margin-bottom: 35px;">
          <h4 style="font-size: 1.15rem; margin-bottom: 16px; color: var(--text-main);">Question Explanations</h4>
          <div style="display: flex; flex-direction: column; gap: 14px;">
            ${QUIZ_QUESTIONS.map((q, idx) => {
              const userPick = userAnswers[idx];
              const isCorrect = userPick === q.answer;
              return `
                <div style="background: rgba(255, 255, 255, 0.02); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 18px;">
                  <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                    <span style="font-weight: 700; font-size: 0.95rem; color: var(--text-main);">${idx + 1}. ${q.question}</span>
                    <span style="font-size: 0.82rem; font-weight: 800; padding: 2px 8px; border-radius: 4px; ${isCorrect ? 'background: rgba(16, 185, 129, 0.15); color: #34d399;' : 'background: rgba(212, 93, 28, 0.15); color: var(--color-amber-light);'}">
                      ${isCorrect ? 'Correct ✓' : 'Review Needed'}
                    </span>
                  </div>
                  <div style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 6px;">
                    <strong>Correct Answer:</strong> ${q.options[q.answer]}
                  </div>
                  <p style="font-size: 0.85rem; color: var(--text-dim); line-height: 1.5; margin: 0;">
                    ${q.explanation}
                  </p>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <div style="display: flex; justify-content: center; gap: 16px; flex-wrap: wrap;">
          <button type="button" id="retakeQuizBtn" class="btn btn-outline">
            🔄 Retake Calibration Quiz
          </button>
          <a href="profile.html" class="btn btn-primary">
            Apply to Skill Assessment Wizard →
          </a>
        </div>

      </div>
    `;

    document.getElementById('retakeQuizBtn')?.addEventListener('click', () => {
      userAnswers.fill(null);
      currentQuestionIndex = 0;
      isSubmitted = false;
      renderQuiz();
    });
  }

  renderQuiz();
}

// ========================================================
// AI Resume ATS Keyword Scanner Controller (resume-scanner.html)
// ========================================================
function setupResumeScanner() {
  const scanBtn = document.getElementById('evaluateResumeBtn');
  const textInput = document.getElementById('resumeTextInput');
  const roleSelect = document.getElementById('resumeRoleSelect');
  const outputContainer = document.getElementById('resumeAtsOutput');

  if (!scanBtn || !textInput || !outputContainer) return;

  scanBtn.addEventListener('click', async () => {
    const rawText = textInput.value.trim();
    const roleId = roleSelect ? roleSelect.value : 'software-developer';

    if (rawText.length < 20) {
      showToast('Please paste your resume text (minimum 20 characters) to evaluate.', 'error');
      textInput.focus();
      textInput.style.borderColor = 'var(--color-terracotta)';
      setTimeout(() => { textInput.style.borderColor = ''; }, 2500);
      return;
    }

    const originalBtnHtml = scanBtn.innerHTML;
    scanBtn.disabled = true;
    scanBtn.innerHTML = `
      <svg class="spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite; margin-right: 8px;">
        <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
        <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
      </svg>
      Scanning Keywords...
    `;

    await new Promise(r => setTimeout(r, 450));

    try {
      const evaluation = SkillPathAPI.evaluateResumeText(rawText, roleId);
      renderScannerOutput(evaluation);
      showToast(`ATS Evaluation Complete: ${evaluation.atsScore}% Keyword Match`, 'success');
      outputContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } catch (err) {
      console.error(err);
      showToast('Could not analyze resume text. Please verify formatting.', 'error');
    } finally {
      scanBtn.disabled = false;
      scanBtn.innerHTML = originalBtnHtml;
    }
  });

  function renderScannerOutput(data) {
    const scoreColor = data.atsScore >= 75 ? '#34d399' : data.atsScore >= 50 ? 'var(--color-amber)' : 'var(--color-terracotta)';
    const ratingLabel = data.atsScore >= 75 ? 'High ATS Compatibility' : data.atsScore >= 50 ? 'Moderate Keyword Density' : 'Low ATS Pass Probability';

    outputContainer.innerHTML = `
      <div class="glass-card" style="margin-top: 30px; padding: 34px; border: 1.5px solid var(--border-bright); box-shadow: var(--shadow-lg); animation: fadeIn 0.4s ease-out;">
        
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; margin-bottom: 24px; border-bottom: 1px solid var(--border-subtle); padding-bottom: 20px;">
          <div>
            <span class="section-tag" style="margin-bottom: 6px;">Evaluation Report</span>
            <h3 style="font-size: 1.5rem; margin-bottom: 4px;">Benchmark Target: ${data.targetRole}</h3>
            <span style="font-size: 0.85rem; color: var(--text-dim);">Evaluated against live hiring requirements & keyword density rules</span>
          </div>

          <div style="display: flex; align-items: center; gap: 16px;">
            <div style="text-align: right;">
              <span style="display: block; font-size: 0.75rem; color: var(--text-dim); text-transform: uppercase; font-weight: 700;">ATS Match Score</span>
              <span style="font-size: 2rem; font-weight: 900; font-family: 'Outfit', sans-serif; color: ${scoreColor};">${data.atsScore}%</span>
            </div>
            <span style="padding: 6px 14px; border-radius: 9999px; font-size: 0.82rem; font-weight: 800; background: rgba(255, 255, 255, 0.05); border: 1px solid var(--border-subtle); color: ${scoreColor};">
              ${ratingLabel}
            </span>
          </div>
        </div>

        <div class="grid-2" style="margin-bottom: 26px; gap: 20px;">
          <!-- Detected Keywords -->
          <div style="background: rgba(16, 185, 129, 0.06); border: 1px solid rgba(16, 185, 129, 0.25); border-radius: var(--radius-md); padding: 20px;">
            <div style="font-size: 0.85rem; font-weight: 800; color: #34d399; margin-bottom: 12px; text-transform: uppercase; display: flex; justify-content: space-between;">
              <span>✓ Detected Keywords</span>
              <span>${data.foundKeywords.length} Found</span>
            </div>
            <div class="tag-cloud">
              ${data.foundKeywords.length > 0 ? data.foundKeywords.map(k => `
                <span class="chip-mastered">✓ ${k}</span>
              `).join('') : '<span style="font-size: 0.88rem; color: var(--text-dim);">No core track keywords found in submitted text.</span>'}
            </div>
          </div>

          <!-- Missing Keywords -->
          <div style="background: rgba(212, 93, 28, 0.06); border: 1px solid rgba(212, 93, 28, 0.25); border-radius: var(--radius-md); padding: 20px;">
            <div style="font-size: 0.85rem; font-weight: 800; color: var(--color-amber-light); margin-bottom: 12px; text-transform: uppercase; display: flex; justify-content: space-between;">
              <span>⚠️ High-Priority Missing Keywords</span>
              <span>${data.missingKeywords.length} Gaps</span>
            </div>
            <div class="tag-cloud">
              ${data.missingKeywords.length > 0 ? data.missingKeywords.map(k => `
                <span class="chip-gap">⚠️ ${k}</span>
              `).join('') : '<span style="font-size: 0.88rem; color: #34d399;">100% of benchmark competencies detected!</span>'}
            </div>
          </div>
        </div>

        <!-- Actionable Optimization Advice -->
        <div style="background: rgba(255, 255, 255, 0.02); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 22px; margin-bottom: 24px;">
          <h4 style="font-size: 1.05rem; margin-bottom: 12px; color: var(--color-cream); font-weight: 800;">Actionable Resume Enhancement Strategy</h4>
          <ul style="padding-left: 20px; display: flex; flex-direction: column; gap: 8px;">
            ${(data.actionableTips || []).map(tip => `
              <li style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.5;">${tip}</li>
            `).join('')}
          </ul>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
          <button type="button" id="resetScannerBtn" class="btn btn-outline btn-sm">
            ← Clear & Scan Another Text
          </button>
          <a href="profile.html?role=${encodeURIComponent(data.targetRole)}" class="btn btn-primary btn-sm">
            Generate Roadmap to Bridge Gaps →
          </a>
        </div>

      </div>
    `;

    document.getElementById('resetScannerBtn')?.addEventListener('click', () => {
      textInput.value = '';
      outputContainer.innerHTML = '';
      textInput.focus();
    });
  }
}
