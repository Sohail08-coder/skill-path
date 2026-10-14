/**
 * SkillPath-AI Authentication & Route Access Engine
 * Controls Verified Spring Security JWT Sessions, Navigation Bar Links, and Strict Route Gating
 * Enforces Zero Pre-Login Data Exposure
 */

const AUTH_API_URL = window.SKILLPATH_AUTH_URL || 'http://localhost:8080/api/auth';

const AuthService = {
  // Get active student user
  getCurrentUser() {
    try {
      const stored = localStorage.getItem('skillpath_user');
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  },

  // Get active session token
  getToken() {
    return localStorage.getItem('skillpath_token') || null;
  },

  // Check if authenticated with valid token structure
  isAuthenticated() {
    const user = this.getCurrentUser();
    const token = this.getToken();
    return Boolean(user && user.email && token && token.length > 20);
  },

  // Register account via Spring Security backend
  async register(userData) {
    const response = await fetch(`${AUTH_API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(userData)
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || data.message || 'Registration failed');
    }

    if (data.token && data.user) {
      this.saveSession(data.user, data.token);
    }
    return data;
  },

  // Log in with credentials via Spring Security JWT backend
  async login(email, password) {
    const response = await fetch(`${AUTH_API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || data.message || 'Invalid email or password');
    }

    if (!data.token || !data.user) {
      throw new Error('Authentication failed: Missing session token');
    }

    this.saveSession(data.user, data.token);
    return data;
  },

  // 1-Click Instant Demo Login (Authenticates through real backend)
  async loginWithDemo(redirectTarget) {
    try {
      const data = await this.login('student@skillpath.ai', 'password123');
      if (typeof showToast === 'function') {
        showToast('Signed in as verified student (student@skillpath.ai)', 'success');
      }
      
      const params = new URLSearchParams(window.location.search);
      const target = redirectTarget || params.get('redirect') || 'dashboard.html';
      
      setTimeout(() => {
        window.location.href = target;
      }, 350);
      return data;
    } catch (err) {
      if (typeof showToast === 'function') {
        showToast('Demo login error: ' + err.message, 'error');
      }
      throw err;
    }
  },

  // Initialize and verify session against backend /api/auth/me
  async verifySessionWithBackend() {
    const token = this.getToken();
    const isProtected = this.isProtectedRoute(window.location.pathname);

    if (!token) {
      if (isProtected) {
        this.enforceRouteProtection();
      }
      return;
    }

    try {
      const response = await fetch(`${AUTH_API_URL}/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        if (data.user) {
          localStorage.setItem('skillpath_user', JSON.stringify(data.user));
          this.renderNavLinks();
          this.renderFooterLinks();
        }
      } else {
        // Invalid, expired, or rejected token: purge local session
        this.clearSession();
        if (isProtected) {
          this.enforceRouteProtection('Your session has expired. Please sign in again.');
        }
      }
    } catch (e) {
      // Backend outage / connection failure
      if (isProtected) {
        this.clearSession();
        this.enforceRouteProtection('Backend authentication server is unreachable. Please verify the backend is running.');
      }
    }
  },

  // Save session state
  saveSession(user, token) {
    localStorage.setItem('skillpath_user', JSON.stringify(user));
    localStorage.setItem('skillpath_token', token || '');
    this.renderNavLinks();
  },

  // Clear session state and sensitive cached data
  clearSession() {
    localStorage.removeItem('skillpath_user');
    localStorage.removeItem('skillpath_token');
    sessionStorage.removeItem('currentAnalysis');
    localStorage.removeItem('skillpath_saved_roadmaps');
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('roadmap_checks_') || key.startsWith('skillpath_'))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));
    this.renderNavLinks();
    this.renderFooterLinks();
  },

  // Log out completely
  logout() {
    this.clearSession();
    if (typeof showToast === 'function') {
      showToast('Signed out successfully', 'info');
    }
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 300);
  },

  // Navigates to a target URL only if authenticated, otherwise redirects to login
  navigateToProtected(targetUrl) {
    if (this.isAuthenticated()) {
      window.location.href = targetUrl;
    } else {
      if (typeof showToast === 'function') {
        showToast('Please sign in to access student features', 'info');
      }
      setTimeout(() => {
        window.location.href = `login.html?redirect=${encodeURIComponent(targetUrl)}`;
      }, 350);
    }
  },

  // Dynamic Navigation Bar Renderer: Short words, zero overlaps
  renderNavLinks() {
    const navLinksContainer = document.querySelector('.nav-links');
    const authActionsContainer = document.getElementById('navAuthContainer');
    const currentPath = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
    const isAuth = this.isAuthenticated();
    const user = this.getCurrentUser();

    // 1. Render structured, short navigation links
    if (navLinksContainer) {
      if (isAuth) {
        // Logged-in full student suite
        navLinksContainer.innerHTML = `
          <li><a href="index.html" class="nav-link ${currentPath === 'index.html' || currentPath === '' ? 'active' : ''}">Home</a></li>
          <li><a href="careers.html" class="nav-link ${currentPath === 'careers.html' ? 'active' : ''}">Tracks</a></li>
          <li><a href="profile.html" class="nav-link ${currentPath === 'profile.html' ? 'active' : ''}">Assessment</a></li>
          <li><a href="roadmap.html" class="nav-link ${currentPath === 'roadmap.html' ? 'active' : ''}">Roadmap</a></li>
          <li><a href="resume-scanner.html" class="nav-link ${currentPath === 'resume-scanner.html' ? 'active' : ''}">ATS Scanner</a></li>
          <li><a href="dashboard.html" class="nav-link ${currentPath === 'dashboard.html' ? 'active' : ''}">Dashboard</a></li>
        `;
      } else {
        // Guest public links: Can browse public Tracks catalogue, Home, and Quiz
        navLinksContainer.innerHTML = `
          <li><a href="index.html" class="nav-link ${currentPath === 'index.html' || currentPath === '' ? 'active' : ''}">Home</a></li>
          <li><a href="careers.html" class="nav-link ${currentPath === 'careers.html' ? 'active' : ''}">Tracks</a></li>
          <li><a href="quiz.html" class="nav-link ${currentPath === 'quiz.html' ? 'active' : ''}">Quiz</a></li>
        `;
      }
    }

    // 2. Render right-side action buttons
    if (authActionsContainer) {
      if (isAuth && user) {
        const initials = (user.name || 'Student')
          .split(' ')
          .map(n => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2);

        authActionsContainer.innerHTML = `
          <div style="display: flex; align-items: center; gap: 8px;">
            <a href="dashboard.html" class="user-nav-badge" title="My Dashboard">
              <span class="user-avatar-mini">${initials}</span>
              <span>${(user.name || 'Student').split(' ')[0]}</span>
            </a>
            <button onclick="AuthService.logout()" class="btn btn-outline btn-sm" title="Sign out" style="padding: 5px 10px; font-size: 0.78rem;">
              Sign Out
            </button>
          </div>
        `;
      } else {
        authActionsContainer.innerHTML = `
          <div style="display: flex; align-items: center; gap: 8px;">
            <a href="login.html" class="btn btn-outline btn-sm">Sign In</a>
            <button onclick="AuthService.loginWithDemo()" class="btn btn-primary btn-sm" title="1-Click Verified Student Login">
              ⚡ Demo Login
            </button>
          </div>
        `;
      }
    }
  },

  // Check if a URL or path refers to a protected student route
  isProtectedRoute(target) {
    if (!target) return false;
    let path = target.split('?')[0].split('#')[0].toLowerCase();
    if (path.startsWith('http://') || path.startsWith('https://')) {
      try {
        path = new URL(path).pathname.toLowerCase();
      } catch (e) {
        // Fallback
      }
    }
    const segment = (path.split('/').filter(Boolean).pop() || '').replace(/\.html$/, '');
    const protectedRoutes = ['profile', 'roadmap', 'resume-scanner', 'dashboard'];
    return protectedRoutes.includes(segment);
  },

  // Dynamic Footer Renderer: Ensures public guests only see public links & login prompts
  renderFooterLinks() {
    const navCol = document.getElementById('footerNavCol');
    const toolsCol = document.getElementById('footerToolsCol');
    const isAuth = this.isAuthenticated();

    if (navCol) {
      if (isAuth) {
        navCol.innerHTML = `
          <h5>Student Platform</h5>
          <ul id="footerNavLinks">
            <li><a href="index.html">Home Overview</a></li>
            <li><a href="careers.html">Career Tracks Catalog</a></li>
            <li><a href="profile.html">Assessment Wizard</a></li>
            <li><a href="roadmap.html">Interactive Roadmap</a></li>
            <li><a href="dashboard.html">Student Dashboard</a></li>
          </ul>
        `;
      } else {
        navCol.innerHTML = `
          <h5>Platform Navigation</h5>
          <ul id="footerNavLinks">
            <li><a href="index.html">Home Overview</a></li>
            <li><a href="careers.html">Career Tracks Catalog</a></li>
            <li><a href="quiz.html">Skill Calibration Quiz</a></li>
            <li><a href="login.html">Sign In (Student Portal)</a></li>
            <li><a href="register.html">Create Student Account</a></li>
          </ul>
        `;
      }
    }

    if (toolsCol) {
      if (isAuth) {
        toolsCol.innerHTML = `
          <h5>Interactive Tools</h5>
          <ul id="footerToolLinks">
            <li><a href="resume-scanner.html">AI Resume ATS Scanner</a></li>
            <li><a href="quiz.html">Skill Calibration Quiz</a></li>
            <li><a href="careers.html">Role Comparison Mode</a></li>
            <li><a href="roadmap.html">Interactive Learning Roadmap</a></li>
          </ul>
        `;
      } else {
        toolsCol.innerHTML = `
          <h5>Interactive Tools</h5>
          <ul id="footerToolLinks">
            <li><a href="quiz.html">Skill Calibration Quiz</a></li>
            <li><a href="careers.html">Role Comparison Mode</a></li>
            <li><a href="login.html?redirect=profile.html">Assessment Wizard <span class="badge-lock" style="font-size: 0.72rem; padding: 2px 6px; background: rgba(111,29,27,0.12); color: var(--autumn-burgundy); border-radius: 4px; font-weight: 700; margin-left: 4px;">🔒 Sign In</span></a></li>
            <li><a href="login.html?redirect=resume-scanner.html">ATS Resume Scanner <span class="badge-lock" style="font-size: 0.72rem; padding: 2px 6px; background: rgba(111,29,27,0.12); color: var(--autumn-burgundy); border-radius: 4px; font-weight: 700; margin-left: 4px;">🔒 Sign In</span></a></li>
          </ul>
        `;
      }
    }
  },

  // Global click interceptor: Prevents guests from navigating to protected URLs
  setupLinkInterception() {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (!link) return;
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('javascript:')) return;
      
      // If user is not authenticated and clicks any link targeting a protected route
      if (this.isProtectedRoute(href) && !this.isAuthenticated()) {
        e.preventDefault();
        e.stopPropagation();
        this.navigateToProtected(href);
      }
    }, true);
  },

  // Strict Route Guard: Protects Assessment, Roadmap, ATS Scanner, and Dashboard
  enforceRouteProtection(customReason) {
    if (!this.isProtectedRoute(window.location.pathname)) {
      return;
    }

    if (this.isAuthenticated()) {
      return; // Authorized!
    }

    const currentPath = (window.location.pathname.split('/').pop() || '').toLowerCase();
    let pageTitle = 'Student Feature';
    if (currentPath.includes('profile')) pageTitle = 'Skill Assessment Wizard';
    if (currentPath.includes('roadmap')) pageTitle = 'Personalized Career Roadmap';
    if (currentPath.includes('resume-scanner')) pageTitle = 'AI Resume ATS Scanner';
    if (currentPath.includes('dashboard')) pageTitle = 'Student Dashboard';

    const targetPage = window.location.pathname + window.location.search;
    const reasonText = customReason || 'This page is protected. Please sign in or use the 1-click verified student account to explore career tracks and access your personalized roadmap.';

    // Lockdown the DOM container immediately so guest users cannot access or view protected content
    const mainEl = document.querySelector('main');
    if (mainEl) {
      mainEl.innerHTML = `
        <div style="min-height: 72vh; display: flex; align-items: center; justify-content: center; padding: 40px 16px;">
          <div class="glass-card" style="max-width: 490px; width: 100%; border: 2px solid var(--autumn-burgundy); border-radius: 26px; padding: 42px 32px; text-align: center; box-shadow: var(--shadow-lg); background: #ffffff;">
            <div style="width: 68px; height: 68px; border-radius: 50%; background: rgba(255, 230, 167, 0.45); display: inline-flex; align-items: center; justify-content: center; font-size: 2.2rem; margin-bottom: 16px; border: 1.5px solid var(--autumn-ochre);">
              🔒
            </div>
            <div style="display: inline-block; padding: 5px 16px; background: rgba(255, 230, 167, 0.55); border: 1px solid var(--autumn-ochre); border-radius: 9999px; color: var(--autumn-espresso); font-size: 0.75rem; font-weight: 800; text-transform: uppercase; margin-bottom: 12px; letter-spacing: 0.04em;">
              Student Access Only
            </div>
            <h2 style="font-size: 1.65rem; font-weight: 800; margin-bottom: 10px; color: var(--autumn-espresso); line-height: 1.25;">
              Sign In to Access ${pageTitle}
            </h2>
            <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.6; margin-bottom: 26px;">
              ${reasonText}
            </p>

            <div style="display: flex; flex-direction: column; gap: 11px; margin-bottom: 20px;">
              <button type="button" onclick="AuthService.loginWithDemo('${encodeURIComponent(targetPage)}')" class="btn btn-primary btn-lg" style="width: 100%;">
                ⚡ 1-Click Verified Student Login
              </button>
              <a href="login.html?redirect=${encodeURIComponent(targetPage)}" class="btn btn-sienna btn-lg" style="width: 100%;">
                Sign In with Student Email
              </a>
              <a href="register.html?redirect=${encodeURIComponent(targetPage)}" class="btn btn-outline" style="width: 100%; border: none; color: var(--autumn-burgundy); font-weight: 700;">
                Create Free Student Account →
              </a>
            </div>

            <a href="index.html" class="btn btn-outline btn-sm" style="color: var(--text-dim); opacity: 0.85;">
              ← Back to Home
            </a>
          </div>
        </div>
      `;
    }
  }
};

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  AuthService.setupLinkInterception();
  AuthService.renderNavLinks();
  AuthService.renderFooterLinks();
  AuthService.enforceRouteProtection();
  AuthService.verifySessionWithBackend();
});
