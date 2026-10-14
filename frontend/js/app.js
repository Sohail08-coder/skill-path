/**
 * SkillPath-AI Frontend Core Logic & Interactive Showcase
 * Handles interactive skill selection, profile submission, hero simulator, and branch calculator
 */

document.addEventListener('DOMContentLoaded', () => {
  setupSkillChips();
  setupProfileForm();
  setupQuickPreview();
  setupHeroSimulator();
  setupBranchCalculator();
});

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
