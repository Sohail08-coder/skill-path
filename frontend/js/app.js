/**
 * SkillPath-AI Application Logic Engine
 * Powers Stepper Wizard, Stream Matcher, Role Catalog, ATS Scanner, Quiz, and Dashboard
 */

document.addEventListener('DOMContentLoaded', () => {
  setupNavbarActiveState();
  setupToastContainer();
  setupStreamFinder();
  setupWizardInteractions();
  setupCareerCatalogPage();
  setupResumeScanner();
  setupSkillQuiz();
  setupDashboardPage();
});

// Toast System
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
  toast.innerHTML = `
    <span style="font-size: 1.1rem;">${type === 'success' ? '✅' : type === 'error' ? '⚠️' : '💡'}</span>
    <span>${message}</span>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 350);
  }, 4500);
}

function setupToastContainer() {
  if (!document.getElementById('toastContainer')) {
    const c = document.createElement('div');
    c.id = 'toastContainer';
    c.className = 'toast-container';
    document.body.appendChild(c);
  }
}

// Active Nav state
function setupNavbarActiveState() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// ========================================================
// 1. STREAM & PASSION PATH FINDER (Home Page Widget)
// ========================================================
function setupStreamFinder() {
  const streamSelect = document.getElementById('finderStreamSelect');
  const interestSelect = document.getElementById('finderInterestSelect');
  const yearSelect = document.getElementById('finderYearSelect');
  const findBtn = document.getElementById('finderSubmitBtn');
  const resultBox = document.getElementById('streamResultBox');

  if (!streamSelect || !interestSelect || !findBtn) return;

  findBtn.addEventListener('click', () => {
    const stream = streamSelect.value;
    const interest = interestSelect.value;
    const year = yearSelect ? yearSelect.value : '3rd Year';

    if (!stream || !interest) {
      showToast('Please select both your college stream and primary interest', 'error');
      return;
    }

    const matches = SkillPathAPI.recommendCareerFromStream(stream, interest);
    const topMatch = matches[0]?.career;
    const matchPct = matches[0]?.matchPercentage || 92;

    if (resultBox && topMatch) {
      resultBox.innerHTML = `
        <div style="display: flex; align-items: flex-start; justify-content: space-between; flex-wrap: wrap; gap: 16px;">
          <div>
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
              <span style="font-size: 1.8rem;">${topMatch.icon}</span>
              <div>
                <span class="badge-stream">${stream} • ${year} Match</span>
                <h3 style="font-size: 1.5rem; margin: 4px 0 0 0;">${topMatch.title}</h3>
              </div>
            </div>
            <p style="color: var(--text-muted); font-size: 0.94rem; margin-bottom: 12px; max-width: 620px;">
              ${topMatch.shortDescription}
            </p>
            <div style="margin-bottom: 16px;">
              <span style="font-size: 0.84rem; color: var(--text-dim); display: block; margin-bottom: 6px;">Recommended Core Skills to Acquire:</span>
              <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                ${topMatch.coreSkills.map(s => `<span class="badge-tag badge-missing" style="font-size: 0.78rem; padding: 4px 10px;">${s}</span>`).join('')}
              </div>
            </div>
          </div>
          <div style="text-align: right; min-width: 170px;">
            <div style="font-size: 2.3rem; font-weight: 900; color: var(--autumn-sienna); font-family: 'Outfit', sans-serif;">
              ${matchPct}% Fit
            </div>
            <div style="font-size: 0.88rem; color: var(--text-dim); margin-bottom: 14px; font-weight: 600;">
              Avg. Pay: <strong style="color: #059669; font-weight: 800;">${topMatch.averageSalaryINR}</strong>
            </div>
            <button onclick="AuthService.navigateToProtected('profile.html?role=${encodeURIComponent(topMatch.title)}&stream=${encodeURIComponent(stream)}&year=${encodeURIComponent(year)}')" class="btn btn-primary btn-sm" style="width: 100%;">
              Synthesize Roadmap →
            </button>
          </div>
        </div>
      `;
      resultBox.classList.add('active');
      showToast(`Matched ${topMatch.title} (${matchPct}% fit for ${stream})!`, 'success');
    }
  });
}

// ========================================================
// 2. ASSESSMENT WIZARD (profile.html)
// ========================================================
function setupWizardInteractions() {
  const wizardForm = document.getElementById('assessmentWizardForm');
  if (!wizardForm) return;

  const currentUser = typeof AuthService !== 'undefined' ? AuthService.getCurrentUser() : null;
  if (currentUser) {
    const nameEl = document.getElementById('wizardName');
    const emailEl = document.getElementById('wizardEmail');
    const branchEl = document.getElementById('wizardBranch');
    const yearEl = document.getElementById('wizardYear');
    if (nameEl && !nameEl.value) nameEl.value = currentUser.name || '';
    if (emailEl && !emailEl.value) emailEl.value = currentUser.email || '';
    if (branchEl && currentUser.branch) branchEl.value = currentUser.branch;
    if (yearEl && currentUser.year) yearEl.value = currentUser.year;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const paramRole = urlParams.get('role');
  const paramStream = urlParams.get('stream');
  const paramYear = urlParams.get('year');

  if (paramStream) {
    const branchEl = document.getElementById('wizardBranch');
    if (branchEl) branchEl.value = paramStream;
  }
  if (paramYear) {
    const yearEl = document.getElementById('wizardYear');
    if (yearEl) yearEl.value = paramYear;
  }
  if (paramRole) {
    const roleEl = document.getElementById('wizardCareerGoal');
    if (roleEl) roleEl.value = paramRole;
  }

  // Stepper logic
  let currentStage = 1;
  const stages = document.querySelectorAll('.wizard-stage');
  const stepIndicators = document.querySelectorAll('.step-indicator');

  function goToStage(stageNum) {
    currentStage = stageNum;
    stages.forEach(s => s.classList.remove('active'));
    stepIndicators.forEach(ind => {
      const stageIdx = Number(ind.getAttribute('data-stage'));
      if (stageIdx === stageNum) {
        ind.classList.add('active');
      } else if (stageIdx < stageNum) {
        ind.classList.remove('active');
        ind.classList.add('completed');
      } else {
        ind.classList.remove('active');
        ind.classList.remove('completed');
      }
    });

    const targetStageEl = document.getElementById(`stage${stageNum}`);
    if (targetStageEl) targetStageEl.classList.add('active');
    updateLiveWizardPreview();
    window.scrollTo({ top: 120, behavior: 'smooth' });
  }

  document.querySelectorAll('.next-stage-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const nextNum = Number(btn.getAttribute('data-next'));
      goToStage(nextNum);
    });
  });

  document.querySelectorAll('.prev-stage-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const prevNum = Number(btn.getAttribute('data-prev'));
      goToStage(prevNum);
    });
  });

  stepIndicators.forEach(ind => {
    ind.addEventListener('click', () => {
      const targetStage = Number(ind.getAttribute('data-stage'));
      goToStage(targetStage);
    });
  });

  // Skill Matrix & Tag Selection
  const selectedSkills = new Set();
  const skillChips = document.querySelectorAll('.skill-matrix-chip');
  const skillCountBadge = document.getElementById('selectedSkillsCountBadge');
  const hiddenSkillsInput = document.getElementById('wizardSkillsHiddenInput');

  function updateSkillMatrixUI() {
    if (skillCountBadge) {
      skillCountBadge.textContent = `${selectedSkills.size} Skills Selected`;
    }
    if (hiddenSkillsInput) {
      hiddenSkillsInput.value = Array.from(selectedSkills).join(', ');
    }
    updateLiveWizardPreview();
  }

  skillChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const skillName = chip.getAttribute('data-skill') || chip.textContent.trim();
      if (selectedSkills.has(skillName)) {
        selectedSkills.delete(skillName);
        chip.classList.remove('selected');
      } else {
        selectedSkills.add(skillName);
        chip.classList.add('selected');
      }
      updateSkillMatrixUI();
    });
  });

  // Custom Skill Add input
  const customSkillInput = document.getElementById('customSkillInput');
  const addCustomSkillBtn = document.getElementById('addCustomSkillBtn');
  const customSkillContainer = document.getElementById('customSkillContainer');

  function addCustomSkill() {
    if (!customSkillInput) return;
    const val = customSkillInput.value.trim();
    if (!val) return;

    if (!selectedSkills.has(val)) {
      selectedSkills.add(val);
      if (customSkillContainer) {
        const chip = document.createElement('span');
        chip.className = 'skill-chip selected';
        chip.textContent = val + ' ✕';
        chip.onclick = () => {
          selectedSkills.delete(val);
          chip.remove();
          updateSkillMatrixUI();
        };
        customSkillContainer.appendChild(chip);
      }
      customSkillInput.value = '';
      updateSkillMatrixUI();
      showToast(`Added custom skill: ${val}`, 'success');
    }
  }

  if (addCustomSkillBtn) addCustomSkillBtn.addEventListener('click', addCustomSkill);
  if (customSkillInput) {
    customSkillInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        addCustomSkill();
      }
    });
  }

  // Presets 1-click loaders
  document.querySelectorAll('.wizard-preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const presetType = btn.getAttribute('data-preset');
      loadWizardPreset(presetType);
    });
  });

  function loadWizardPreset(preset) {
    selectedSkills.clear();
    skillChips.forEach(c => c.classList.remove('selected'));

    const nameEl = document.getElementById('wizardName');
    const branchEl = document.getElementById('wizardBranch');
    const yearEl = document.getElementById('wizardYear');
    const roleEl = document.getElementById('wizardCareerGoal');
    const cgpaEl = document.getElementById('wizardCgpa');

    if (preset === 'cse-web') {
      if (nameEl) nameEl.value = 'Aarav Sharma';
      if (branchEl) branchEl.value = 'Computer Science & Engineering';
      if (yearEl) yearEl.value = '3rd Year';
      if (roleEl) roleEl.value = 'Modern Full Stack Engineer (MERN / Next.js)';
      if (cgpaEl) cgpaEl.value = '8.80';
      ['Modern JavaScript', 'React / Next.js', 'Node.js & Express', 'HTML5 & Responsive CSS', 'SQL & RDBMS', 'Git & GitHub'].forEach(s => selectedSkills.add(s));
    } else if (preset === 'aiml') {
      if (nameEl) nameEl.value = 'Priya Patel';
      if (branchEl) branchEl.value = 'AI & Machine Learning';
      if (yearEl) yearEl.value = '3rd Year';
      if (roleEl) roleEl.value = 'AI / Machine Learning Engineer';
      if (cgpaEl) cgpaEl.value = '9.10';
      ['Python', 'Linear Algebra & Statistics', 'Machine Learning', 'Pandas & Data Wrangling', 'Git & GitHub'].forEach(s => selectedSkills.add(s));
    } else if (preset === 'ece-embed') {
      if (nameEl) nameEl.value = 'Karthik Rao';
      if (branchEl) branchEl.value = 'Electronics & Communication';
      if (yearEl) yearEl.value = '4th Year';
      if (roleEl) roleEl.value = 'Embedded Systems & IoT Firmware Engineer';
      if (cgpaEl) cgpaEl.value = '8.40';
      ['Embedded C / Modern C++', 'Microcontroller Architecture (ARM Cortex/ESP32)', 'Git & GitHub'].forEach(s => selectedSkills.add(s));
    } else {
      // 1st year beginner
      if (nameEl) nameEl.value = 'Rohan Gupta';
      if (branchEl) branchEl.value = 'Computer Science & Engineering';
      if (yearEl) yearEl.value = '1st Year';
      if (roleEl) roleEl.value = 'Software Developer (Java / Cloud)';
      if (cgpaEl) cgpaEl.value = '8.20';
      ['Java', 'Data Structures & Algorithms'].forEach(s => selectedSkills.add(s));
    }

    // Highlight chips
    skillChips.forEach(c => {
      const sName = c.getAttribute('data-skill') || c.textContent.trim();
      if (selectedSkills.has(sName)) c.classList.add('selected');
    });

    updateSkillMatrixUI();
    showToast(`Loaded preset profile for ${preset.toUpperCase()}!`, 'success');
  }

  // Live score preview calculation
  function updateLiveWizardPreview() {
    const previewScoreNum = document.getElementById('livePreviewScore');
    const previewRoleTitle = document.getElementById('livePreviewRole');
    const previewStrengths = document.getElementById('livePreviewStrengths');
    const roleGoal = document.getElementById('wizardCareerGoal')?.value || 'Software Developer (Java / Cloud)';

    if (previewRoleTitle) previewRoleTitle.textContent = roleGoal;
    
    // Quick estimation
    const count = selectedSkills.size;
    const est = Math.min(95, Math.max(25, count * 12 + 15));
    if (previewScoreNum) previewScoreNum.textContent = `${est}%`;
    if (previewStrengths) previewStrengths.textContent = `${count} Skills Picked`;
  }

  // Form Submit
  wizardForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = document.getElementById('wizardSubmitBtn');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `Synthesizing AI Roadmap...`;
    }

    // Gather coursework
    const checkedCourses = Array.from(document.querySelectorAll('input[name="coursework"]:checked')).map(cb => cb.value);

    const formData = new FormData(wizardForm);
    const studentData = {
      name: formData.get('name') || 'Student',
      email: formData.get('email') || 'student@university.edu',
      branch: formData.get('branch') || 'Computer Science & Engineering',
      year: formData.get('year') || '3rd Year',
      cgpa: parseFloat(formData.get('cgpa') || '8.5'),
      careerGoal: formData.get('careerGoal') || 'Software Developer (Java / Cloud)',
      skills: Array.from(selectedSkills).join(', '),
      coursework: checkedCourses,
      targetCompanies: formData.get('targetCompanies') || 'Top Product Tech & Startups',
      weeklyHours: formData.get('weeklyHours') || '15'
    };

    try {
      const analysisResult = await SkillPathAPI.registerStudent(studentData);
      sessionStorage.setItem('currentAnalysis', JSON.stringify(analysisResult));
      showToast('Roadmap synthesized successfully! Redirecting...', 'success');
      setTimeout(() => {
        window.location.href = 'roadmap.html';
      }, 700);
    } catch (err) {
      console.error(err);
      showToast('Error generating roadmap: ' + (err.message || 'Server unavailable'), 'error');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `Calculate Readiness & Generate Roadmap →`;
      }
    }
  });
}

// ========================================================
// 3. CAREER CATALOG & MODAL & COMPARISON (careers.html)
// ========================================================
function setupCareerCatalogPage() {
  const grid = document.getElementById('careerCardsGrid');
  if (!grid) return;

  let allCareers = CAREER_CATALOG;
  const searchInput = document.getElementById('careerSearchInput');
  const streamFilter = document.getElementById('careerStreamFilter');

  function renderCards(careers) {
    grid.innerHTML = '';
    if (careers.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
          <h3 style="font-size: 1.5rem; margin-bottom: 8px;">No matching career tracks found</h3>
          <p style="color: var(--text-muted);">Try adjusting your search query or stream filter.</p>
        </div>
      `;
      return;
    }

    careers.forEach((career, idx) => {
      const autumnPalette = [
        { border: 'rgba(111, 29, 27, 0.45)', iconBg: 'rgba(111, 29, 27, 0.12)', badgeColor: 'var(--autumn-burgundy)' },
        { border: 'rgba(153, 88, 42, 0.45)', iconBg: 'rgba(153, 88, 42, 0.12)', badgeColor: 'var(--autumn-sienna)' },
        { border: 'rgba(187, 148, 87, 0.5)', iconBg: 'rgba(187, 148, 87, 0.15)', badgeColor: '#8F6B2C' },
        { border: 'rgba(67, 40, 24, 0.35)', iconBg: 'rgba(255, 230, 167, 0.55)', badgeColor: 'var(--autumn-espresso)' }
      ];
      const themeColor = autumnPalette[idx % autumnPalette.length];

      const card = document.createElement('div');
      card.className = 'glass-card card-hover-3d shimmer-hover career-card';
      card.style.border = `1.5px solid ${themeColor.border}`;
      card.style.boxShadow = 'var(--shadow-sm)';
      card.innerHTML = `
        <div style="display: flex; flex-direction: column; justify-content: space-between; height: 100%;">
          <div>
            <div class="career-card-top">
              <div class="career-icon-wrapper" style="font-size: 1.8rem; background: ${themeColor.iconBg}; width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; border-radius: var(--radius-sm); border: 1px solid ${themeColor.border};">
                ${career.icon}
              </div>
              <span class="demand-badge" style="background: ${themeColor.iconBg}; color: ${themeColor.badgeColor}; border-color: ${themeColor.border}; font-weight: 800;">
                ${career.demandLevel} Demand
              </span>
            </div>

            <h3 style="font-size: 1.35rem; margin-bottom: 6px; color: var(--text-main); font-weight: 800;">${career.title}</h3>
            <p style="color: var(--text-muted); font-size: 0.92rem; margin-bottom: 16px; min-height: 48px; line-height: 1.5;">
              ${career.shortDescription}
            </p>

            <div class="career-meta-row" style="margin-bottom: 16px; background: #f8fafc; border: 1px solid var(--border-subtle);">
              <div>
                <span style="font-size: 0.76rem; color: var(--text-dim); font-weight: 600;">Avg Salary (India)</span>
                <strong style="color: #059669; font-weight: 800; font-size: 0.95rem;">${career.averageSalaryINR}</strong>
              </div>
              <div>
                <span style="font-size: 0.76rem; color: var(--text-dim); font-weight: 600;">Avg Salary (US)</span>
                <strong style="color: var(--text-main); font-weight: 800; font-size: 0.95rem;">${career.averageSalaryUSD}</strong>
              </div>
            </div>

            <div style="margin-bottom: 18px;">
              <span style="font-size: 0.8rem; color: var(--text-dim); display: block; margin-bottom: 6px; font-weight: 700; text-transform: uppercase;">Prerequisite Stack:</span>
              <div class="skill-chips">
                ${career.coreSkills.slice(0, 5).map(s => `<span class="skill-chip" style="font-size: 0.78rem; padding: 4px 10px; background: #ffffff; border: 1px solid var(--border-bright); color: var(--text-main); font-weight: 600;">${s}</span>`).join('')}
              </div>
            </div>
          </div>

          <div style="display: flex; gap: 8px; margin-top: 14px;">
            <button class="btn btn-outline btn-sm view-role-details-btn" data-role-id="${career.id}" style="flex: 1;">
              Curriculum & QA 🔍
            </button>
            <button onclick="AuthService.navigateToProtected('profile.html?role=${encodeURIComponent(career.title)}')" class="btn btn-primary btn-sm" style="flex: 1; text-align: center;">
              Start Track →
            </button>
          </div>
        </div>
      `;
      grid.appendChild(card);
    });

    // Attach click listeners to role modal buttons
    document.querySelectorAll('.view-role-details-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const rId = btn.getAttribute('data-role-id');
        openRoleDetailModal(rId);
      });
    });
  }

  renderCards(allCareers);

  // Filters & Search
  function filterCatalog() {
    const q = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const st = streamFilter ? streamFilter.value.toLowerCase().trim() : 'all';
    const activeCategoryBtn = document.querySelector('.filter-btn.active');
    const cat = activeCategoryBtn ? activeCategoryBtn.getAttribute('data-category') : 'ALL';

    const filtered = allCareers.filter(c => {
      const matchSearch = c.title.toLowerCase().includes(q) || 
                          c.shortDescription.toLowerCase().includes(q) || 
                          c.coreSkills.some(s => s.toLowerCase().includes(q));
      
      const matchCat = cat === 'ALL' || c.category.toLowerCase().includes(cat.toLowerCase());
      
      const matchStream = st === 'all' || c.streamAffinity.some(a => a === 'All Streams' || a === 'All Engineering' || a.toLowerCase().includes(st));

      return matchSearch && matchCat && matchStream;
    });

    renderCards(filtered);
  }

  if (searchInput) searchInput.addEventListener('input', filterCatalog);
  if (streamFilter) streamFilter.addEventListener('change', filterCatalog);

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterCatalog();
    });
  });
}

// Role Detail Modal
function openRoleDetailModal(roleId) {
  const career = CAREER_CATALOG.find(c => c.id === roleId);
  if (!career) return;

  let modal = document.getElementById('roleDetailModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'roleDetailModal';
    modal.className = 'modal-backdrop';
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="modal-container" style="background: #ffffff; border: 2px solid var(--border-blue); box-shadow: var(--shadow-lg);">
      <div class="modal-header">
        <div style="display: flex; align-items: center; gap: 12px;">
          <span style="font-size: 2rem;">${career.icon}</span>
          <div>
            <h2 style="font-size: 1.6rem; margin: 0; color: var(--text-main); font-weight: 800;">${career.title}</h2>
            <span style="color: var(--autumn-sienna); font-size: 0.85rem; font-weight: 700;">${career.category} • ${career.difficulty} Level</span>
          </div>
        </div>
        <button class="modal-close-btn" onclick="document.getElementById('roleDetailModal').classList.remove('open')">✕</button>
      </div>

      <div class="modal-body" style="font-size: 0.95rem;">
        <p style="color: var(--text-muted); margin-bottom: 20px; line-height: 1.6;">${career.shortDescription}</p>

        <div style="background: #f8fafc; padding: 16px; border-radius: var(--radius-md); border: 1.5px solid var(--border-subtle); margin-bottom: 20px;">
          <h4 style="font-size: 1rem; margin-bottom: 8px; color: var(--text-main); font-weight: 800;">🏢 Top Hiring Companies</h4>
          <div style="display: flex; flex-wrap: wrap; gap: 8px;">
            ${(career.topCompanies || ['Google', 'Microsoft', 'Amazon', 'Startups']).map(comp => `<span class="badge-tag" style="background: rgba(153, 88, 42, 0.1); border: 1px solid rgba(153, 88, 42, 0.3); color: var(--autumn-sienna); font-size: 0.82rem; font-weight: 700;">${comp}</span>`).join('')}
          </div>
        </div>

        <div style="margin-bottom: 20px;">
          <h4 style="font-size: 1rem; margin-bottom: 8px; color: var(--text-main); font-weight: 800;">📚 Recommended Free Learning Resources</h4>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${(career.learningResources || []).map(r => `
              <a href="${r.url}" target="_blank" rel="noopener noreferrer" style="color: var(--autumn-sienna); text-decoration: none; font-weight: 600; display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background: #ffffff; border-radius: var(--radius-xs); border: 1px solid var(--border-subtle); box-shadow: var(--shadow-xs);">
                <span>${r.name}</span>
                <span style="font-weight: 800;">↗</span>
              </a>
            `).join('')}
          </div>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px; border-top: 1px solid var(--border-subtle); padding-top: 18px;">
          <button class="btn btn-outline btn-sm" onclick="document.getElementById('roleDetailModal').classList.remove('open')">Close</button>
          <button onclick="AuthService.navigateToProtected('profile.html?role=${encodeURIComponent(career.title)}')" class="btn btn-primary btn-sm">Generate AI Roadmap →</button>
        </div>
      </div>
    </div>
  `;

  modal.classList.add('open');
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('open');
  });
}

// ========================================================
// 4. RESUME & ATS ANALYZER (resume-scanner.html)
// ========================================================
function setupResumeScanner() {
  const evaluateBtn = document.getElementById('evaluateResumeBtn');
  const resumeTextarea = document.getElementById('resumeTextInput');
  const roleSelect = document.getElementById('resumeRoleSelect');
  const outputBox = document.getElementById('resumeAtsOutput');

  if (!evaluateBtn || !resumeTextarea || !roleSelect || !outputBox) return;

  evaluateBtn.addEventListener('click', () => {
    const text = resumeTextarea.value.trim();
    const roleId = roleSelect.value;

    if (!text || text.length < 30) {
      showToast('Please paste your resume text (at least 30 characters)', 'error');
      return;
    }

    const evalResult = SkillPathAPI.evaluateResumeText(text, roleId);

    outputBox.innerHTML = `
      <div class="glass-card" style="margin-top: 25px; border: 1.5px solid var(--border-blue); box-shadow: var(--shadow-md);">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; margin-bottom: 20px;">
          <div>
            <span class="section-tag" style="background: rgba(153, 88, 42, 0.1); color: var(--autumn-sienna); border-color: rgba(153, 88, 42, 0.3);">ATS Match Report</span>
            <h3 style="font-size: 1.5rem; margin-top: 4px; color: var(--text-main); font-weight: 800;">Target Role: ${evalResult.targetRole}</h3>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 2.6rem; font-weight: 900; color: ${evalResult.atsScore >= 70 ? '#059669' : 'var(--autumn-burgundy)'}; font-family: 'Outfit', sans-serif;">
              ${evalResult.atsScore}%
            </div>
            <span style="font-size: 0.85rem; color: var(--text-dim); font-weight: 600;">ATS Keyword Match</span>
          </div>
        </div>

        <div style="margin-bottom: 20px;">
          <h4 style="font-size: 1rem; color: #059669; margin-bottom: 8px; font-weight: 800;">✅ Detected In Resume (${evalResult.foundKeywords.length})</h4>
          <div style="display: flex; flex-wrap: wrap; gap: 6px;">
            ${evalResult.foundKeywords.length ? evalResult.foundKeywords.map(k => `<span class="badge-tag badge-acquired" style="font-size: 0.82rem; padding: 5px 11px;">${k}</span>`).join('') : '<span style="color: var(--text-muted); font-size: 0.88rem;">No high-priority keywords detected</span>'}
          </div>
        </div>

        <div style="margin-bottom: 20px;">
          <h4 style="font-size: 1rem; color: var(--autumn-burgundy); margin-bottom: 8px; font-weight: 800;">⚠️ Missing Critical ATS Keywords (${evalResult.missingKeywords.length})</h4>
          <div style="display: flex; flex-wrap: wrap; gap: 6px;">
            ${evalResult.missingKeywords.map(k => `<span class="badge-tag badge-missing" style="font-size: 0.82rem; padding: 5px 11px;">+ Add ${k}</span>`).join('')}
          </div>
        </div>

        <div style="background: #f8fafc; padding: 18px; border-radius: var(--radius-md); border: 1.5px solid var(--border-subtle);">
          <h4 style="font-size: 1rem; color: var(--autumn-sienna); margin-bottom: 8px; font-weight: 800;">💡 Actionable ATS Optimization Tips</h4>
          <ul style="padding-left: 20px; font-size: 0.92rem; color: var(--text-main); line-height: 1.6;">
            ${evalResult.actionableTips.map(t => `<li style="margin-bottom: 6px;">${t}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;

    showToast(`ATS Analysis Complete: ${evalResult.atsScore}% Match`, 'success');
  });
}

// ========================================================
// 5. INTERACTIVE KNOWLEDGE QUIZ (quiz.html)
// ========================================================
const QUIZ_QUESTIONS = [
  {
    q: 'Which data structure offers average O(1) time complexity for key lookups?',
    options: ['Binary Search Tree', 'Hash Table (HashMap)', 'Linked List', 'Array without index'],
    correct: 1,
    explanation: 'Hash Tables use hash functions to index buckets, achieving O(1) average lookup.'
  },
  {
    q: 'In REST API architecture, which HTTP method is idempotent and used for replacing a resource?',
    options: ['POST', 'PATCH', 'PUT', 'DELETE'],
    correct: 2,
    explanation: 'PUT is idempotent and replaces the target resource entirely.'
  },
  {
    q: 'What is the primary purpose of Docker containerization in software engineering?',
    options: ['Replace relational databases', 'Package code with all dependencies for reproducible environments', 'Accelerate CPU clock frequency', 'Encrypt Git commits'],
    correct: 1,
    explanation: 'Docker isolates runtime environments so code runs consistently anywhere.'
  },
  {
    q: 'In relational database theory, what does ACID stand for?',
    options: ['Atomicity, Consistency, Isolation, Durability', 'Algorithm, Cache, Index, Distribution', 'Array, Chain, Interval, Dynamic', 'Async, Callback, Interval, Defer'],
    correct: 0,
    explanation: 'ACID properties guarantee reliable database transactions.'
  },
  {
    q: 'Which Git command safely brings remote commits into your local branch while integrating changes?',
    options: ['git push --force', 'git pull', 'git stash drop', 'git clean -fd'],
    correct: 1,
    explanation: 'git pull fetches and merges remote changes into the active branch.'
  }
];

function setupSkillQuiz() {
  const quizContainer = document.getElementById('skillQuizContainer');
  if (!quizContainer) return;

  let currentIdx = 0;
  let correctCount = 0;

  function renderQuestion() {
    if (currentIdx >= QUIZ_QUESTIONS.length) {
      // Finished
      const pct = Math.round((correctCount / QUIZ_QUESTIONS.length) * 100);
      quizContainer.innerHTML = `
        <div class="glass-card" style="text-align: center; padding: 40px 20px;">
          <div style="font-size: 3rem; margin-bottom: 12px;">🏆</div>
          <span class="section-tag">Assessment Verified</span>
          <h2 style="font-size: 2rem; margin: 8px 0;">Quiz Completed!</h2>
          <div style="font-size: 2.8rem; font-weight: 900; color: var(--accent-emerald); margin-bottom: 12px; font-family: 'Outfit', sans-serif;">
            ${correctCount} / ${QUIZ_QUESTIONS.length} (${pct}%)
          </div>
          <p style="color: var(--text-muted); max-width: 500px; margin: 0 auto 24px;">
            ${pct >= 80 ? 'Outstanding! You demonstrated strong foundational engineering mastery.' : 'Good effort! Review the missed concepts in your personalized roadmap.'}
          </p>
          <div style="display: flex; justify-content: center; gap: 12px;">
            <a href="profile.html" class="btn btn-primary">Generate Roadmap with Verified Badge →</a>
          </div>
        </div>
      `;
      return;
    }

    const item = QUIZ_QUESTIONS[currentIdx];
    quizContainer.innerHTML = `
      <div class="glass-card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <span class="badge-stream">Question ${currentIdx + 1} of ${QUIZ_QUESTIONS.length}</span>
          <span style="color: var(--text-dim); font-size: 0.85rem;">Score: ${correctCount}</span>
        </div>
        <h3 style="font-size: 1.25rem; margin-bottom: 20px;">${item.q}</h3>
        <div id="quizOptionsList">
          ${item.options.map((opt, i) => `
            <button class="quiz-option-btn" data-idx="${i}" style="background: #ffffff; border: 1.5px solid var(--border-bright); color: var(--text-main); font-weight: 600;">
              <span style="font-weight: 800; color: var(--autumn-sienna);">${String.fromCharCode(65 + i)}.</span>
              <span>${opt}</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;

    document.querySelectorAll('.quiz-option-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const selected = Number(btn.getAttribute('data-idx'));
        const allBtns = document.querySelectorAll('.quiz-option-btn');
        allBtns.forEach(b => b.disabled = true);

        if (selected === item.correct) {
          btn.classList.add('correct');
          btn.style.borderColor = '#059669';
          btn.style.background = 'rgba(6, 214, 160, 0.12)';
          correctCount++;
          showToast('Correct Answer! 🎉', 'success');
        } else {
          btn.classList.add('incorrect');
          btn.style.borderColor = 'var(--autumn-burgundy)';
          btn.style.background = 'rgba(111, 29, 27, 0.12)';
          if (allBtns[item.correct]) {
            allBtns[item.correct].classList.add('correct');
            allBtns[item.correct].style.borderColor = '#059669';
            allBtns[item.correct].style.background = 'rgba(6, 214, 160, 0.12)';
          }
          showToast('Incorrect concept. Added to review queue.', 'error');
        }

        setTimeout(() => {
          currentIdx++;
          renderQuestion();
        }, 1400);
      });
    });
  }

  renderQuestion();
}

// ========================================================
// 6. DASHBOARD & HISTORY (dashboard.html)
// ========================================================
async function setupDashboardPage() {
  const savedListEl = document.getElementById('savedRoadmapsTableBody');
  if (!savedListEl) return;

  const currentUser = typeof AuthService !== 'undefined' ? AuthService.getCurrentUser() : null;
  const token = typeof AuthService !== 'undefined' ? AuthService.getToken() : null;
  let savedRoadmaps = [];
  let historyLoadError = null;

  // Fetch real database records from backend if authenticated
  if (token) {
    try {
      const response = await fetch(`${API_BASE_URL}/students/my-history`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      if (response.ok) {
        const dbRecords = await response.json();
        if (Array.isArray(dbRecords)) {
          savedRoadmaps = dbRecords.map(r => ({
            id: r.id,
            date: r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent',
            student: {
              name: currentUser?.name || 'Student',
              email: r.userEmail,
              branch: r.branch,
              year: r.year,
              cgpa: r.cgpa,
              careerGoal: r.careerGoal,
              skills: r.acquiredSkills
            },
            careerGoal: r.careerGoal,
            readinessScore: r.readinessScore,
            missingCount: r.missingSkills ? r.missingSkills.split(',').filter(Boolean).length : 0,
            acquiredCount: r.acquiredSkills ? r.acquiredSkills.split(',').filter(Boolean).length : 0
          }));
        }
      } else if (response.status === 401 || response.status === 403) {
        AuthService.clearSession();
        AuthService.enforceRouteProtection('Session expired. Please sign in.');
        return;
      } else {
        historyLoadError = 'Server returned error ' + response.status;
      }
    } catch (e) {
      historyLoadError = 'Backend service unreachable';
      if (typeof showToast === 'function') {
        showToast('Backend connection failed. Please ensure server is running on port 8080.', 'error');
      }
    }
  }

  if (currentUser) {
    const nameEl = document.getElementById('dashStudentName');
    const metaEl = document.getElementById('dashStudentMeta');
    const roleEl = document.getElementById('dashTargetRole');
    const scoreEl = document.getElementById('dashScore');
    const acqEl = document.getElementById('dashAcquiredCount');
    const gapEl = document.getElementById('dashGapsCount');

    if (nameEl) nameEl.textContent = currentUser.name ? `${currentUser.name}'s Dashboard` : 'Student Dashboard';
    if (metaEl) metaEl.textContent = `${currentUser.branch || 'Engineering'} • ${currentUser.year || '3rd Year'} • University: ${currentUser.university || 'Tech University'}`;
    
    if (savedRoadmaps.length > 0) {
      const latest = savedRoadmaps[0];
      if (roleEl) roleEl.textContent = latest.careerGoal;
      if (scoreEl) scoreEl.textContent = `${latest.readinessScore}%`;
      if (acqEl) acqEl.textContent = `${latest.acquiredCount} Skills`;
      if (gapEl) gapEl.textContent = `${latest.missingCount} Gaps`;
    } else {
      if (roleEl) roleEl.textContent = 'Not Evaluated Yet';
      if (scoreEl) scoreEl.textContent = '--%';
      if (acqEl) acqEl.textContent = '--';
      if (gapEl) gapEl.textContent = '--';
    }
  }

  if (historyLoadError) {
    savedListEl.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; padding: 35px; color: var(--autumn-burgundy); font-size: 0.95rem; font-weight: 700;">
          ⚠️ ${historyLoadError}. Ensure the backend Spring Boot server is running on port 8080.
        </td>
      </tr>
    `;
    return;
  }

  if (savedRoadmaps.length === 0) {
    savedListEl.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; padding: 35px; color: var(--text-muted); font-size: 0.95rem;">
          No saved evaluations yet. Complete the <a href="profile.html" style="color: var(--autumn-sienna); font-weight: 700;">Assessment Wizard</a> to generate and save your roadmap!
        </td>
      </tr>
    `;
    return;
  }

  savedListEl.innerHTML = savedRoadmaps.map((r, i) => `
    <tr style="border-bottom: 1px solid var(--border-subtle); background: #ffffff;">
      <td style="padding: 16px 18px;">
        <strong style="color: var(--text-main); font-size: 0.95rem;">${r.careerGoal}</strong>
        <span style="display: block; font-size: 0.8rem; color: var(--text-dim); margin-top: 2px;">${r.student?.branch || 'Engineering'}</span>
      </td>
      <td style="padding: 16px 18px; color: var(--text-muted); font-size: 0.88rem; font-weight: 500;">${r.date || 'Recent'}</td>
      <td style="padding: 16px 18px;">
        <span style="font-weight: 800; font-size: 1.05rem; color: ${r.readinessScore >= 70 ? '#059669' : 'var(--autumn-burgundy)'};">${r.readinessScore}%</span>
      </td>
      <td style="padding: 16px 18px; font-size: 0.88rem;">
        <span style="color: #059669; font-weight: 700;">${r.acquiredCount || 0} Strengths</span> / <span style="color: var(--autumn-burgundy); font-weight: 700;">${r.missingCount || 0} Gaps</span>
      </td>
      <td style="padding: 16px 18px; text-align: right;">
        <button class="btn btn-outline-blue btn-sm restore-roadmap-btn" data-idx="${i}">
          Load Roadmap →
        </button>
      </td>
    </tr>
  `).join('');

  document.querySelectorAll('.restore-roadmap-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.getAttribute('data-idx'));
      const chosen = savedRoadmaps[idx];
      if (chosen) {
        const full = SkillPathAPI.synthesizeAnalysis({
          ...chosen.student,
          id: chosen.id,
          recordId: chosen.id
        }, false);
        full.recordId = chosen.id;
        sessionStorage.setItem('currentAnalysis', JSON.stringify(full));
        window.location.href = 'roadmap.html';
      }
    });
  });
}
