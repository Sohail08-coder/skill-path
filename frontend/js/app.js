/**
 * SkillPath-AI Frontend Core Logic
 * Handles interactive skill selection, profile submission, and state management
 */

document.addEventListener('DOMContentLoaded', () => {
  setupSkillChips();
  setupProfileForm();
  setupQuickPreview();
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

// Interactive skill chip toggle
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
      showToast('Generating personalized AI skill roadmap...', 'info');
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
