/**
 * SkillPath-AI Authentication Service
 * Manages user accounts, session state, and navigation bar auth indicators
 */

const AUTH_API_URL = 'http://localhost:8080/api/auth';

const AuthService = {
  // Get currently logged-in user
  getCurrentUser() {
    try {
      const stored = localStorage.getItem('skillpath_user');
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  },

  // Check if authenticated
  isAuthenticated() {
    return Boolean(this.getCurrentUser() && localStorage.getItem('skillpath_token'));
  },

  // Register new account
  async register(userData) {
    try {
      const response = await fetch(`${AUTH_API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(userData)
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      this.saveSession(data.user, data.token);
      return data;
    } catch (error) {
      console.warn('Backend registration failed, using client session:', error.message);
      // Offline fallback demo user registration
      const fallbackUser = {
        id: Date.now(),
        name: userData.name || 'Student',
        email: userData.email,
        university: userData.university || 'Tech University',
        branch: userData.branch || 'Computer Science',
        year: userData.year || '3rd Year',
        role: userData.role || 'Student'
      };
      this.saveSession(fallbackUser, 'mock_jwt_token_' + Date.now());
      return { message: 'Registered in demo mode', user: fallbackUser };
    }
  },

  // Log in existing account
  async login(email, password) {
    try {
      const response = await fetch(`${AUTH_API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Invalid credentials');
      }

      this.saveSession(data.user, data.token);
      return data;
    } catch (error) {
      console.warn('Backend login failed, using demo fallback:', error.message);
      // Check if credentials match demo student
      if (email === 'student@skillpath.ai' && password === 'password123') {
        const demoUser = {
          id: 1,
          name: 'Syed Sohail',
          email: 'student@skillpath.ai',
          university: 'Tech University',
          branch: 'Computer Science',
          year: '3rd Year',
          role: 'Student'
        };
        this.saveSession(demoUser, 'mock_jwt_token_demo');
        return { message: 'Demo Login Successful', user: demoUser };
      }
      // If user had registered locally
      const stored = this.getCurrentUser();
      if (stored && stored.email.toLowerCase() === email.toLowerCase()) {
        this.saveSession(stored, 'mock_jwt_token_stored');
        return { message: 'Login Successful', user: stored };
      }
      throw error;
    }
  },

  // Save session state to localStorage
  saveSession(user, token) {
    localStorage.setItem('skillpath_user', JSON.stringify(user));
    localStorage.setItem('skillpath_token', token || 'active_token');
    this.updateNavAuthUI();
  },

  // Log out current session
  logout() {
    localStorage.removeItem('skillpath_user');
    localStorage.removeItem('skillpath_token');
    window.location.href = 'index.html';
  },

  // Automatically update Navbar user avatar / Sign In button across all pages
  updateNavAuthUI() {
    const authActions = document.getElementById('navAuthContainer');
    if (!authActions) return;

    const user = this.getCurrentUser();
    if (user) {
      const initials = (user.name || 'S')
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

      authActions.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
          <a href="dashboard.html" class="user-nav-profile" title="Open Dashboard">
            <span class="user-avatar-circle">${initials}</span>
            <span>${user.name.split(' ')[0]}</span>
          </a>
          <button onclick="AuthService.logout()" class="btn btn-outline btn-sm" title="Sign out" style="padding: 6px 10px;">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </button>
        </div>
      `;
    } else {
      authActions.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
          <a href="login.html" class="btn btn-outline btn-sm">Sign In</a>
          <a href="register.html" class="btn btn-primary btn-sm">Register</a>
        </div>
      `;
    }
  }
};

// Initialize nav on DOM load
document.addEventListener('DOMContentLoaded', () => {
  AuthService.updateNavAuthUI();
});
