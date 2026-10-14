/**
 * SkillPath-AI Interactive Roadmap Engine
 * Renders SVG readiness gauge, priority skill gap comparison, and interactive milestone topic checklists
 */

let currentAnalysisData = null;
let completedTopicsSet = new Set();

document.addEventListener('DOMContentLoaded', () => {
  loadAndRenderRoadmap();
  setupPrintButton();
});

function loadAndRenderRoadmap() {
  const stored = sessionStorage.getItem('currentAnalysis');

  if (stored) {
    try {
      currentAnalysisData = JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse stored analysis', e);
    }
  }

  // Fallback demo data if user navigates directly to roadmap.html
  if (!currentAnalysisData) {
    currentAnalysisData = {
      student: {
        name: 'Alex Morgan',
        email: 'alex.morgan@university.edu',
        branch: 'Computer Science & Engineering',
        year: '3rd Year',
        cgpa: 8.70,
        careerGoal: 'Software Developer'
      },
      careerGoal: 'Software Developer',
      readinessScore: 68,
      missingSkills: ['Spring Boot', 'Docker', 'REST APIs', 'System Design'],
      acquiredSkills: ['Java', 'Data Structures & Algorithms', 'SQL', 'Git & GitHub'],
      roadmap: [
        {
          stepNumber: 1,
          title: 'Core Programming & Data Structures',
          duration: '4-5 Weeks',
          description: 'Solidify algorithmic complexity analysis, binary trees, dynamic programming, and Java 21 fundamentals.',
          topics: ['Java 21 Fundamentals', 'Trees & Graph Traversal', 'Dynamic Programming', 'LeetCode Mediums'],
          status: 'In Progress'
        },
        {
          stepNumber: 2,
          title: 'Database & Relational Persistence',
          duration: '3-4 Weeks',
          description: 'Master advanced SQL joins, indexing techniques, transactions, and Spring Data JPA entities.',
          topics: ['MySQL Optimization', 'Indexing Strategies', 'JPA Hibernate Entities', 'ACID Transactions'],
          status: 'In Progress'
        },
        {
          stepNumber: 3,
          title: 'Enterprise Spring Boot & REST APIs',
          duration: '5-6 Weeks',
          description: 'Build enterprise-grade microservices with Spring Boot, security, and automated testing.',
          topics: ['Spring Web MVC', 'Spring Security JWT', 'Unit & Mockito Testing', 'Postman API Specs'],
          status: 'Priority Focus'
        },
        {
          stepNumber: 4,
          title: 'DevOps, Containers & Cloud Deployment',
          duration: '3-4 Weeks',
          description: 'Containerize backend workloads, configure CI/CD pipelines, and deploy on cloud infrastructure.',
          topics: ['Docker Multi-stage Builds', 'GitHub Actions CI', 'AWS ECS / Render Hosting', 'Monitoring & Actuator'],
          status: 'Priority Focus'
        }
      ],
      recommendedProjects: [
        'Full Stack Cloud-Native Marketplace with Spring Boot & Stripe Integration',
        'Distributed Real-Time Chat & Notification Service with WebSockets & Redis',
        'Scalable Algorithmic Code Judge Platform with Sandbox Execution'
      ],
      recommendedCertifications: [
        'Oracle Certified Professional: Java SE Developer (OCPJP)',
        'Spring Certified Professional 2026',
        'AWS Certified Solutions Architect - Associate'
      ],
      summary: 'Strong algorithmic and persistence foundation! Focus on modern Spring Boot API development and Docker containerization to become production ready.'
    };
  }

  // Load saved checklist states
  const savedChecks = localStorage.getItem(`roadmap_checks_${currentAnalysisData.student?.name || 'default'}`);
  if (savedChecks) {
    try {
      completedTopicsSet = new Set(JSON.parse(savedChecks));
    } catch (e) {}
  }

  renderStudentHeader(currentAnalysisData);
  renderScoreMeter(calculateLiveScore());
  renderSkillsLists(currentAnalysisData.missingSkills || [], currentAnalysisData.acquiredSkills || []);
  renderTimeline(currentAnalysisData.roadmap || []);
  renderRecommendations(currentAnalysisData.recommendedProjects || [], currentAnalysisData.recommendedCertifications || []);
}

function calculateLiveScore() {
  const baseScore = currentAnalysisData.readinessScore || 65;
  const extraBonus = completedTopicsSet.size * 3;
  return Math.min(100, baseScore + extraBonus);
}

function renderStudentHeader(data) {
  const student = data.student || {};
  const nameEl = document.getElementById('studentName');
  const careerEl = document.getElementById('studentCareerGoal');
  const metaEl = document.getElementById('studentMetaDetails');
  const summaryEl = document.getElementById('analysisSummaryText');

  if (nameEl) nameEl.textContent = student.name || 'Student';
  if (careerEl) careerEl.textContent = data.careerGoal || student.careerGoal || 'Software Developer';
  if (metaEl) {
    metaEl.textContent = `${student.branch || 'Engineering'} • ${student.year || '3rd Year'} • CGPA: ${student.cgpa || '8.5'}`;
  }
  if (summaryEl) {
    summaryEl.textContent = data.summary || 'Your personalized AI career roadmap has been synthesized.';
  }
}

function renderScoreMeter(score) {
  const scoreNumEl = document.getElementById('scoreNumber');
  const circleProgress = document.getElementById('circleProgress');
  const meterHeading = document.getElementById('meterHeading');
  const meterSub = document.getElementById('meterSub');

  if (scoreNumEl) {
    scoreNumEl.textContent = `${score}%`;
  }

  if (circleProgress) {
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    circleProgress.style.strokeDasharray = `${circumference}`;
    const offset = circumference - (score / 100) * circumference;
    setTimeout(() => {
      circleProgress.style.strokeDashoffset = `${offset}`;
    }, 150);
  }

  if (meterHeading && meterSub) {
    if (score >= 85) {
      meterHeading.textContent = 'High Market Readiness';
      meterSub.textContent = 'Outstanding profile! You possess almost all core skills required for top tier engineering interviews.';
    } else if (score >= 60) {
      meterHeading.textContent = 'Intermediate Foundation';
      meterSub.textContent = 'Strong technical fundamentals. Bridging the highlighted skill gaps below will elevate your interview success rate.';
    } else {
      meterHeading.textContent = 'Foundational Learning Stage';
      meterSub.textContent = 'Great start! Follow the tailored milestones below step-by-step to build your target engineering stack.';
    }
  }
}

function renderSkillsLists(missing, acquired) {
  const missingContainer = document.getElementById('missingSkillsList');
  const acquiredContainer = document.getElementById('acquiredSkillsList');

  if (missingContainer) {
    if (!missing.length) {
      missingContainer.innerHTML = '<p style="color: var(--text-dim); font-size: 0.9rem;">No major gaps detected. Ready for advanced mastery!</p>';
    } else {
      missingContainer.innerHTML = missing.map(skill => `
        <span class="badge-tag badge-missing">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
          ${skill}
        </span>
      `).join('');
    }
  }

  if (acquiredContainer) {
    if (!acquired.length) {
      acquiredContainer.innerHTML = '<p style="color: var(--text-dim); font-size: 0.9rem;">Add current skills to highlight your acquired competencies.</p>';
    } else {
      acquiredContainer.innerHTML = acquired.map(skill => `
        <span class="badge-tag badge-acquired">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          ${skill}
        </span>
      `).join('');
    }
  }
}

function renderTimeline(roadmap) {
  const container = document.getElementById('roadmapTimeline');
  if (!container) return;

  container.innerHTML = roadmap.map(step => {
    const topicsHtml = (step.topics || []).map(topic => {
      const isChecked = completedTopicsSet.has(topic);
      return `
        <label class="check-item ${isChecked ? 'completed' : ''}" data-topic="${topic}">
          <input type="checkbox" ${isChecked ? 'checked' : ''} onchange="toggleTopicCheck('${topic}', this)">
          <span>${topic}</span>
        </label>
      `;
    }).join('');

    return `
      <div class="timeline-step">
        <div class="timeline-marker">${step.stepNumber}</div>
        <div class="step-card">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; flex-wrap: wrap; gap: 8px;">
            <h4 style="font-size: 1.3rem; margin: 0;">${step.title}</h4>
            <span style="font-size: 0.82rem; font-weight: 700; background: rgba(99, 102, 241, 0.15); color: #a5b4fc; padding: 4px 12px; border-radius: 9999px; border: 1px solid rgba(99, 102, 241, 0.3);">
              ${step.duration}
            </span>
          </div>
          <p style="color: var(--text-muted); font-size: 0.94rem; margin-bottom: 16px;">
            ${step.description}
          </p>
          <div class="checklist-group">
            ${topicsHtml}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Interactive topic checklist toggle
window.toggleTopicCheck = function(topic, checkboxEl) {
  if (checkboxEl.checked) {
    completedTopicsSet.add(topic);
    checkboxEl.closest('.check-item').classList.add('completed');
  } else {
    completedTopicsSet.delete(topic);
    checkboxEl.closest('.check-item').classList.remove('completed');
  }

  // Save state
  localStorage.setItem(
    `roadmap_checks_${currentAnalysisData.student?.name || 'default'}`,
    JSON.stringify(Array.from(completedTopicsSet))
  );

  // Update dynamic score ring
  renderScoreMeter(calculateLiveScore());
};

function renderRecommendations(projects, certs) {
  const projectsContainer = document.getElementById('projectsList');
  const certsContainer = document.getElementById('certsList');

  if (projectsContainer) {
    projectsContainer.innerHTML = projects.map((p, i) => `
      <div class="item-box">
        <div class="item-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="16 18 22 12 16 6"></polyline>
            <polyline points="8 6 2 12 8 18"></polyline>
          </svg>
        </div>
        <div class="item-content">
          <h5>Project 0${i + 1}: ${p}</h5>
          <p>Portfolio-grade architecture demonstrating clean code, exception boundaries, and cloud deployment.</p>
        </div>
      </div>
    `).join('');
  }

  if (certsContainer) {
    certsContainer.innerHTML = certs.map(c => `
      <div class="item-box">
        <div class="item-icon" style="color: var(--accent-pink); background: rgba(236, 72, 153, 0.12);">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="8" r="7"></circle>
            <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
          </svg>
        </div>
        <div class="item-content">
          <h5>${c}</h5>
          <p>Recognized credential to validate competencies and pass automated resume screening filters.</p>
        </div>
      </div>
    `).join('');
  }
}

function setupPrintButton() {
  const printBtn = document.getElementById('printRoadmapBtn');
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }
}
