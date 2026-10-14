/**
 * SkillPath-AI API Service Layer
 * Connects Frontend SPA to Spring Boot Backend REST APIs
 */

const API_BASE_URL = 'http://localhost:8080/api';

const SkillPathAPI = {
  // Check if Spring Boot backend is active
  async checkHealth() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.warn('Backend server is not reachable at ' + API_BASE_URL, error);
      return null;
    }
  },

  // Register student and receive comprehensive skill gap & roadmap analysis
  async registerStudent(studentData) {
    try {
      const response = await fetch(`${API_BASE_URL}/students`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(studentData)
      });
      
      if (!response.ok) {
        throw new Error(`Server returned status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.warn('API call failed, engaging intelligent client fallback:', error);
      // Fallback local simulation so user can test without database/backend
      return this.simulateLocalAnalysis(studentData, false);
    }
  },

  // Instant analysis preview without saving to database
  async analyzeSkills(studentData) {
    try {
      const response = await fetch(`${API_BASE_URL}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(studentData)
      });
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      return this.simulateLocalAnalysis(studentData, true);
    }
  },

  // Retrieve all registered students
  async getAllStudents() {
    try {
      const response = await fetch(`${API_BASE_URL}/students`, {
        headers: { 'Accept': 'application/json' }
      });
      if (response.ok) {
        return await response.json();
      }
      return [];
    } catch (error) {
      // Check localStorage for offline demo students
      const local = localStorage.getItem('skillpath_students');
      return local ? JSON.parse(local) : [];
    }
  },

  // Retrieve single student analysis by id
  async getStudentById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/students/${id}`, {
        headers: { 'Accept': 'application/json' }
      });
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      const local = localStorage.getItem('skillpath_current_analysis');
      return local ? JSON.parse(local) : null;
    }
  },

  // Intelligent client-side fallback ensuring seamless UX even when backend is offline
  simulateLocalAnalysis(student, isPreviewOnly) {
    const skillsText = (student.skills || '').toLowerCase();
    const career = (student.careerGoal || '').toLowerCase();

    let requiredSkills = [];
    let roadmap = [];
    let projects = [];
    let certs = [];

    if (career.includes('software')) {
      requiredSkills = ['Java', 'Data Structures & Algorithms', 'SQL', 'Git & GitHub', 'Spring Boot', 'REST APIs', 'Docker'];
      roadmap = [
        { stepNumber: 1, title: 'Core Programming & DSA', duration: '4-6 Weeks', description: 'Master object-oriented programming, complexity analysis, and core data structures.', topics: ['Java fundamentals', 'Arrays & Strings', 'Trees & Graphs', 'Dynamic Programming'] },
        { stepNumber: 2, title: 'Database & Backend Fundamentals', duration: '3-4 Weeks', description: 'Learn relational data modeling, query optimization, and transaction handling.', topics: ['SQL syntax', 'Normalization', 'Indexing', 'JPA / Hibernate'] },
        { stepNumber: 3, title: 'Spring Boot & RESTful Services', duration: '4-5 Weeks', description: 'Build production-grade APIs, implement validation, security, and exception handling.', topics: ['Spring MVC', 'Spring Data JPA', 'Spring Security', 'Postman Testing'] },
        { stepNumber: 4, title: 'DevOps & Cloud Deployment', duration: '2-3 Weeks', description: 'Containerize services and set up basic continuous integration pipelines.', topics: ['Docker containerization', 'GitHub Actions CI', 'Cloud hosting'] }
      ];
      projects = [
        'Full Stack E-Commerce Platform with Spring Boot & Payment Gateway',
        'Scalable Microservices-based Task & Notification Engine',
        'High-Concurrency URL Shortener with Redis Caching'
      ];
      certs = [
        'Oracle Certified Professional: Java SE Developer',
        'Spring Certified Professional',
        'AWS Certified Developer - Associate'
      ];
    } else if (career.includes('ai') || career.includes('ml')) {
      requiredSkills = ['Python', 'Statistics & Linear Algebra', 'Machine Learning', 'Deep Learning', 'TensorFlow / PyTorch', 'Natural Language Processing', 'MLOps'];
      roadmap = [
        { stepNumber: 1, title: 'Mathematical Foundation & Python', duration: '4-5 Weeks', description: 'Solidify Python scripting, NumPy, Pandas, linear algebra, and calculus.', topics: ['NumPy & Pandas', 'Multivariate Calculus', 'Probability Distributions', 'Data Preprocessing'] },
        { stepNumber: 2, title: 'Classical Machine Learning', duration: '4-6 Weeks', description: 'Implement supervised and unsupervised learning algorithms and evaluate metrics.', topics: ['Linear/Logistic Regression', 'Decision Trees', 'SVM', 'Cross Validation'] },
        { stepNumber: 3, title: 'Deep Learning & Neural Networks', duration: '5-7 Weeks', description: 'Design convolutional and recurrent networks using modern deep learning frameworks.', topics: ['PyTorch / TensorFlow', 'CNNs for Computer Vision', 'Transformers & Attention', 'Fine-tuning LLMs'] },
        { stepNumber: 4, title: 'Model Deployment & MLOps', duration: '3-4 Weeks', description: 'Package models behind REST endpoints and track model metrics in production.', topics: ['FastAPI Model Serving', 'Docker for ML', 'MLflow Tracking', 'HuggingFace Spaces'] }
      ];
      projects = [
        'Multimodal Sentiment & Intent Classifier with Fine-Tuned Transformer',
        'Real-time Object Detection and Tracking System with YOLO and OpenCV',
        'RAG-Powered AI Knowledge Assistant with LangChain and Vector DB'
      ];
      certs = [
        'DeepLearning.AI Deep Learning Specialization',
        'TensorFlow Developer Certificate',
        'AWS Certified Machine Learning - Specialty'
      ];
    } else if (career.includes('data scientist')) {
      requiredSkills = ['Python', 'SQL', 'Statistics', 'Machine Learning', 'Pandas & Data Wrangling', 'Data Visualization', 'Big Data Analytics'];
      roadmap = [
        { stepNumber: 1, title: 'Exploratory Data Analysis & Statistics', duration: '4-5 Weeks', description: 'Extract insights, run hypothesis tests, and clean unstructured data.', topics: ['Advanced Pandas', 'Hypothesis Testing', 'Seaborn/Plotly', 'Statistical Inference'] },
        { stepNumber: 2, title: 'Predictive Modeling & Feature Engineering', duration: '4-5 Weeks', description: 'Engineer predictive features and train baseline to ensemble models.', topics: ['Scikit-Learn', 'Feature Importance', 'XGBoost & LightGBM', 'Cross-Validation'] },
        { stepNumber: 3, title: 'Big Data & Distributed Computing', duration: '3-4 Weeks', description: 'Work with scalable data pipelines and distributed compute frameworks.', topics: ['PySpark', 'SQL Window Functions', 'Data Lakes', 'ETL Pipelines'] },
        { stepNumber: 4, title: 'Business Storytelling & Deployment', duration: '2-3 Weeks', description: 'Transform model outputs into executive dashboards and production workflows.', topics: ['Streamlit Apps', 'Executive Presentations', 'A/B Testing Frameworks'] }
      ];
      projects = [
        'Customer Lifetime Value (LTV) Prediction & Churn Early-Warning System',
        'Algorithmic Trading & Financial Market Anomaly Detector',
        'End-to-End Housing Market Price Predictor with Streamlit Dashboard'
      ];
      certs = [
        'IBM Data Science Professional Certificate',
        'Google Advanced Data Analytics Certificate',
        'Microsoft Certified: Azure Data Scientist Associate'
      ];
    } else {
      requiredSkills = ['Modern JavaScript', 'HTML5 & Responsive CSS', 'React / Next.js', 'Node.js & Express', 'REST APIs', 'SQL / NoSQL', 'Git'];
      roadmap = [
        { stepNumber: 1, title: 'Modern Frontend Core', duration: '3-4 Weeks', description: 'Master semantic HTML, responsive flexbox/grid layouts, and modern CSS3.', topics: ['Semantic HTML5', 'Responsive Grid/Flexbox', 'CSS Animations', 'DOM Manipulation'] },
        { stepNumber: 2, title: 'JavaScript & Modern Frameworks', duration: '4-6 Weeks', description: 'Build rich interactive UIs using React or Next.js with state management.', topics: ['Async/Await & Promises', 'React Hooks & State', 'Component Architecture', 'TailwindCSS'] },
        { stepNumber: 3, title: 'Backend Server & Database', duration: '4-5 Weeks', description: 'Build robust server applications and integrate databases.', topics: ['Node.js / Express or Spring Boot', 'PostgreSQL / MongoDB', 'Authentication (JWT)', 'REST API Design'] },
        { stepNumber: 4, title: 'Full Stack Integration & Cloud', duration: '2-3 Weeks', description: 'Deploy full-stack web applications with automated testing and continuous deployment.', topics: ['Vercel / Render Deployment', 'End-to-End Testing', 'Web Performance Optimization'] }
      ];
      projects = [
        'Collaborative Kanban Project Management App with Real-Time WebSockets',
        'Modern SaaS Landing Page & Subscription Dashboard with Stripe Billing',
        'Social Network Community Feed with Infinite Scroll & Instant Messaging'
      ];
      certs = [
        'Meta Front-End Developer Professional Certificate',
        'Meta Back-End Developer Professional Certificate',
        'freeCodeCamp Full Stack Developer Certification'
      ];
    }

    const acquiredSkills = [];
    const missingSkills = [];

    requiredSkills.forEach(skill => {
      const lower = skill.toLowerCase();
      let match = false;
      if (lower.includes('/')) {
        match = lower.split('/').some(s => skillsText.includes(s.trim()));
      } else if (lower.includes('&')) {
        match = lower.split('&').some(s => skillsText.includes(s.trim()));
      } else {
        match = skillsText.includes(lower);
      }

      if (match) {
        acquiredSkills.push(skill);
      } else {
        missingSkills.push(skill);
      }
    });

    const score = Math.max(15, Math.round((acquiredSkills.length / requiredSkills.length) * 100));

    const result = {
      student: {
        ...student,
        id: student.id || Date.now()
      },
      careerGoal: student.careerGoal,
      readinessScore: score,
      missingSkills,
      acquiredSkills,
      roadmap,
      recommendedProjects: projects,
      recommendedCertifications: certs,
      summary: `Client-preview analysis for ${student.name || 'Student'}: ${acquiredSkills.length} acquired skills, ${missingSkills.length} gap areas identified. Readiness Score: ${score}%.`
    };

    if (!isPreviewOnly) {
      // Save locally as backup
      const existing = JSON.parse(localStorage.getItem('skillpath_students') || '[]');
      existing.unshift(result.student);
      localStorage.setItem('skillpath_students', JSON.stringify(existing.slice(0, 50)));
    }

    return result;
  }
};

// Global Status Bar Updater
window.addEventListener('DOMContentLoaded', async () => {
  const badge = document.getElementById('backendStatusBadge');
  if (badge) {
    const health = await SkillPathAPI.checkHealth();
    if (health) {
      badge.className = 'server-badge';
      badge.innerHTML = '<span class="status-indicator"></span> Backend: Online (Port 8080)';
    } else {
      badge.className = 'server-badge offline';
      badge.innerHTML = '<span class="status-indicator"></span> Backend: Offline (Preview Mode)';
    }
  }
});
