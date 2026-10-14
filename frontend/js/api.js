/**
 * SkillPath-AI API & Intelligence Engine
 * Connects Frontend SPA to Spring Boot Backend REST APIs
 * Provides high-fidelity offline simulation for 16+ tech tracks, stream transition algorithms, and ATS resume scoring
 */

const API_BASE_URL = window.SKILLPATH_API_URL || localStorage.getItem('SKILLPATH_API_URL') || 'http://localhost:8080/api';

const CAREER_CATALOG = [
  {
    id: 'software-developer',
    title: 'Software Developer (Java / Cloud)',
    category: 'Software Engineering',
    streamAffinity: ['CSE', 'IT', 'ECE', 'All Engineering'],
    difficulty: 'Intermediate',
    demandLevel: 'Extremely High',
    averageSalaryUSD: '$115,000',
    averageSalaryINR: '₹14-24 LPA',
    recommendedDuration: '16-20 Weeks',
    icon: '☕',
    accentColor: '#6366f1',
    shortDescription: 'Build high-concurrency microservices, robust REST APIs, and enterprise cloud systems with Java, Spring Boot, and Docker.',
    coreSkills: ['Java', 'Data Structures & Algorithms', 'Spring Boot', 'SQL & RDBMS', 'REST APIs', 'Docker', 'Git & GitHub', 'System Design'],
    topTools: ['IntelliJ IDEA', 'Docker', 'Postman', 'MySQL / PostgreSQL', 'Git', 'Maven / Gradle'],
    topCompanies: ['Amazon', 'Microsoft', 'Oracle', 'JPMorgan Chase', 'Uber', 'Goldman Sachs'],
    learningResources: [
      { name: 'Java 21 Documentation', url: 'https://docs.oracle.com/en/java/' },
      { name: 'Spring Boot Official Guides', url: 'https://spring.io/guides' },
      { name: 'NeetCode DSA Roadmap', url: 'https://neetcode.io/roadmap' },
      { name: 'roadmap.sh / Java', url: 'https://roadmap.sh/java' }
    ],
    streamBridgeAdvice: {
      'ECE': 'As an ECE student, your strong digital logic and low-level understanding gives you an edge in memory optimization and concurrency. Focus on Object-Oriented Design (OOP) and SQL transactions.',
      'Mechanical': 'Focus on building algorithmic problem solving through Java syntax before jumping directly into Spring frameworks. Highlight analytical modeling skills.',
      'BCA': 'Strengthen core CS theory (OS concepts, ACID transactions, and Time Complexity) to excel in technical rounds.',
      'Default': 'Solidify your data structures foundation while simultaneously building modular Spring Boot REST microservices.'
    }
  },
  {
    id: 'fullstack-web',
    title: 'Modern Full Stack Engineer (MERN / Next.js)',
    category: 'Web Development',
    streamAffinity: ['CSE', 'IT', 'BCA', 'MCA', 'All Streams'],
    difficulty: 'Intermediate',
    demandLevel: 'Extremely High',
    averageSalaryUSD: '$110,000',
    averageSalaryINR: '₹12-22 LPA',
    recommendedDuration: '16-18 Weeks',
    icon: '⚛️',
    accentColor: '#06b6d4',
    shortDescription: 'Architect end-to-end interactive web platforms, reactive frontends, and serverless backends using React, Next.js, Node.js, and TypeScript.',
    coreSkills: ['Modern JavaScript', 'TypeScript', 'React / Next.js', 'Node.js & Express', 'TailwindCSS', 'PostgreSQL / MongoDB', 'REST & GraphQL', 'Git & GitHub'],
    topTools: ['VS Code', 'Next.js', 'Prisma ORM', 'Postman', 'Vercel', 'Docker'],
    topCompanies: ['Stripe', 'Airbnb', 'Netflix', 'Shopify', 'Zomato', 'Swiggy', 'Razorpay'],
    learningResources: [
      { name: 'React 19 Official Documentation', url: 'https://react.dev' },
      { name: 'Next.js App Router Learn', url: 'https://nextjs.org/learn' },
      { name: 'freeCodeCamp Full Stack Curriculum', url: 'https://www.freecodecamp.org' },
      { name: 'roadmap.sh / Full Stack', url: 'https://roadmap.sh/full-stack' }
    ],
    streamBridgeAdvice: {
      'ECE': 'Your understanding of signals and state machines translates cleanly into asynchronous JavaScript and React state lifecycle management.',
      'Mechanical': 'Visual component composition in React is intuitive! Focus on DOM architecture, JavaScript event loops, and RESTful database CRUD operations.',
      'Default': 'Master TypeScript and Next.js Server Components to stand out from average boot-camp applicants.'
    }
  },
  {
    id: 'ai-ml-engineer',
    title: 'AI / Machine Learning Engineer',
    category: 'Artificial Intelligence',
    streamAffinity: ['CSE', 'AI/DS', 'ECE', 'Math & Stats'],
    difficulty: 'Advanced',
    demandLevel: 'Extremely High',
    averageSalaryUSD: '$135,000',
    averageSalaryINR: '₹18-36 LPA',
    recommendedDuration: '20-24 Weeks',
    icon: '🧠',
    accentColor: '#8b5cf6',
    shortDescription: 'Train deep neural models, fine-tune Generative AI LLMs, engineer RAG pipelines, and deploy production MLOps workflows.',
    coreSkills: ['Python', 'Linear Algebra & Statistics', 'Machine Learning', 'Deep Learning', 'PyTorch / TensorFlow', 'LangChain & RAG', 'MLOps & FastAPI', 'Vector Databases'],
    topTools: ['Jupyter', 'PyTorch', 'Hugging Face', 'Weights & Biases', 'ChromaDB / Pinecone', 'Docker'],
    topCompanies: ['Google DeepMind', 'OpenAI', 'Meta AI', 'Microsoft', 'NVIDIA', 'Anthropic'],
    learningResources: [
      { name: 'DeepLearning.AI Short Courses', url: 'https://www.deeplearning.ai' },
      { name: 'PyTorch Official Tutorials', url: 'https://pytorch.org/tutorials/' },
      { name: 'Fast.ai Practical Deep Learning', url: 'https://course.fast.ai' },
      { name: 'Hugging Face NLP Course', url: 'https://huggingface.co/learn' }
    ],
    streamBridgeAdvice: {
      'ECE': 'Signals and Fourier transforms provide a mathematical foundation for convolutional networks and audio/speech AI.',
      'Mechanical': 'Your multivariable calculus and matrix operations map directly to tensor computations in PyTorch.',
      'Default': 'Do not stop at Jupyter notebooks! Build production FastAPI endpoints and Dockerized model serving pipelines.'
    }
  },
  {
    id: 'data-scientist',
    title: 'Data Scientist & Analytics Engineer',
    category: 'Data Science',
    streamAffinity: ['CSE', 'AI/DS', 'Economics', 'Math & Stats', 'All Streams'],
    difficulty: 'Intermediate',
    demandLevel: 'Very High',
    averageSalaryUSD: '$120,000',
    averageSalaryINR: '₹14-26 LPA',
    recommendedDuration: '16-20 Weeks',
    icon: '📊',
    accentColor: '#10b981',
    shortDescription: 'Transform raw multi-gigabyte data into predictive business models, statistical insights, and automated executive dashboards.',
    coreSkills: ['Python', 'Advanced SQL', 'Pandas & NumPy', 'Statistical Inference & A/B Testing', 'Scikit-Learn', 'Tableau / PowerBI', 'Data Wrangling', 'BigQuery / Snowflake'],
    topTools: ['Jupyter Notebook', 'Tableau', 'Power BI', 'dbt', 'Snowflake', 'Git'],
    topCompanies: ['Amazon', 'McKinsey', 'Boston Consulting Group', 'Uber', 'Spotify', 'Walmart'],
    learningResources: [
      { name: 'Kaggle Learn Micro-Courses', url: 'https://www.kaggle.com/learn' },
      { name: 'Mode Analytics SQL Tutorial', url: 'https://mode.com/sql-tutorial/' },
      { name: 'StatQuest with Josh Starmer', url: 'https://statquest.org' },
      { name: 'roadmap.sh / Data Science', url: 'https://roadmap.sh/data-science' }
    ],
    streamBridgeAdvice: {
      'All': 'Recruiters value business acumen combined with SQL precision. Always demonstrate the business revenue impact of your models.'
    }
  },
  {
    id: 'cloud-devops',
    title: 'Cloud Solutions & DevOps Architect',
    category: 'Cloud Infrastructure',
    streamAffinity: ['CSE', 'IT', 'ECE', 'Networking'],
    difficulty: 'Advanced',
    demandLevel: 'Extremely High',
    averageSalaryUSD: '$128,000',
    averageSalaryINR: '₹16-30 LPA',
    recommendedDuration: '18-22 Weeks',
    icon: '☁️',
    accentColor: '#3b82f6',
    shortDescription: 'Automate zero-downtime CI/CD pipelines, orchestrate Kubernetes clusters, and architect resilient infrastructure on AWS & Azure.',
    coreSkills: ['Linux Fundamentals', 'AWS / Azure / GCP', 'Docker Containers', 'Kubernetes Orchestration', 'Terraform (IaC)', 'CI/CD Pipelines (GitHub Actions)', 'Monitoring (Prometheus/Grafana)', 'Bash / Python Scripting'],
    topTools: ['Docker', 'Kubernetes (K8s)', 'Terraform', 'GitHub Actions', 'Prometheus', 'AWS Console'],
    topCompanies: ['Amazon Web Services', 'Microsoft Azure', 'Google Cloud', 'Red Hat', 'HashiCorp', 'Cisco'],
    learningResources: [
      { name: 'AWS Skill Builder Free Tier', url: 'https://skillbuilder.aws' },
      { name: 'Kubernetes Documentation Tutorials', url: 'https://kubernetes.io/docs/tutorials/' },
      { name: 'Learn Terraform by HashiCorp', url: 'https://developer.hashicorp.com/terraform/tutorials' },
      { name: 'roadmap.sh / DevOps', url: 'https://roadmap.sh/devops' }
    ],
    streamBridgeAdvice: {
      'ECE': 'Your networking foundation (TCP/IP, Subnetting, OSI model) is an enormous superpower for Cloud VPCs, Load Balancers, and DNS routing.'
    }
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity Analyst & Ethical Hacker',
    category: 'Information Security',
    streamAffinity: ['CSE', 'IT', 'ECE', 'All Engineering'],
    difficulty: 'Advanced',
    demandLevel: 'Extremely High',
    averageSalaryUSD: '$122,000',
    averageSalaryINR: '₹15-28 LPA',
    recommendedDuration: '18-24 Weeks',
    icon: '🛡️',
    accentColor: '#ec4899',
    shortDescription: 'Defend enterprise infrastructure, conduct vulnerability penetration testing, audit cryptographic protocols, and investigate threat vectors.',
    coreSkills: ['Computer Networks & TCP/IP', 'Linux & Bash', 'Ethical Hacking & PenTesting', 'OWASP Top 10 Security', 'Cryptography Basics', 'SIEM & SOC Tools', 'Python for Security', 'Wireshark & Nmap'],
    topTools: ['Kali Linux', 'Wireshark', 'Burp Suite', 'Metasploit', 'Nmap', 'Splunk'],
    topCompanies: ['Palo Alto Networks', 'CrowdStrike', 'Cloudflare', 'Mandiant', 'Cisco', 'Deloitte'],
    learningResources: [
      { name: 'TryHackMe Cyber Labs', url: 'https://tryhackme.com' },
      { name: 'PortSwigger Web Security Academy', url: 'https://portswigger.net/web-security' },
      { name: 'OverTheWire Wargames', url: 'https://overthewire.org' },
      { name: 'roadmap.sh / Cyber Security', url: 'https://roadmap.sh/cyber-security' }
    ],
    streamBridgeAdvice: {
      'ECE': 'Hardware security, bus snooping, and RF transmission protocols make you uniquely suited for IoT and hardware penetration testing.'
    }
  },
  {
    id: 'mobile-developer',
    title: 'Mobile App Developer (Flutter & React Native)',
    category: 'Mobile Development',
    streamAffinity: ['CSE', 'IT', 'BCA', 'All Streams'],
    difficulty: 'Intermediate',
    demandLevel: 'High',
    averageSalaryUSD: '$105,000',
    averageSalaryINR: '₹10-20 LPA',
    recommendedDuration: '14-18 Weeks',
    icon: '📱',
    accentColor: '#f59e0b',
    shortDescription: 'Craft silky-smooth, cross-platform iOS and Android mobile applications with offline persistence and reactive state.',
    coreSkills: ['Flutter / Dart or React Native', 'Mobile UI/UX Design', 'State Management (Bloc/Riverpod/Redux)', 'REST APIs & WebSockets', 'SQLite / Hive Persistence', 'App Store / Play Store Deployment', 'Firebase Integration'],
    topTools: ['Flutter SDK', 'Android Studio', 'Xcode', 'Firebase', 'Figma', 'Postman'],
    topCompanies: ['Uber', 'Instagram', 'Spotify', 'Flipkart', 'Cred', 'Duolingo'],
    learningResources: [
      { name: 'Flutter Official Codelabs', url: 'https://docs.flutter.dev/get-started/codelab' },
      { name: 'React Native Docs', url: 'https://reactnative.dev/docs/getting-started' },
      { name: 'Android Developers Guide', url: 'https://developer.android.com' },
      { name: 'roadmap.sh / Flutter', url: 'https://roadmap.sh/flutter' }
    ]
  },
  {
    id: 'embedded-iot',
    title: 'Embedded Systems & IoT Firmware Engineer',
    category: 'Hardware & IoT',
    streamAffinity: ['ECE', 'EEE', 'Mechatronics', 'CSE'],
    difficulty: 'Advanced',
    demandLevel: 'High',
    averageSalaryUSD: '$118,000',
    averageSalaryINR: '₹12-25 LPA',
    recommendedDuration: '18-22 Weeks',
    icon: '⚡',
    accentColor: '#10b981',
    shortDescription: 'Program microcontrollers, real-time operating systems (RTOS), I2C/SPI protocols, and IoT edge hardware for autonomous vehicles and smart robotics.',
    coreSkills: ['Embedded C / Modern C++', 'Microcontroller Architecture (ARM Cortex/ESP32)', 'FreeRTOS & Multithreading', 'Communication Protocols (UART, SPI, I2C, CAN)', 'Circuit Debugging (Oscilloscope/Logic Analyzer)', 'MQTT & IoT Cloud Connectivity', 'Git'],
    topTools: ['STM32CubeIDE', 'ESP-IDF', 'PlatformIO', 'Saleae Logic', 'KiCad', 'Keil uVision'],
    topCompanies: ['Qualcomm', 'Texas Instruments', 'Tesla', 'Intel', 'Bosch', 'Apple Hardware'],
    learningResources: [
      { name: 'Embedded Systems University of Texas (EdX)', url: 'https://www.edx.org' },
      { name: 'ESP32 Official Espressif Guides', url: 'https://docs.espressif.com' },
      { name: 'Quantum Leaps Modern Embedded C Programming', url: 'https://www.youtube.com/@QuantumLeaps' }
    ],
    streamBridgeAdvice: {
      'ECE': 'This is your natural premier career pathway! You have an inherent advantage over pure CS students because you understand hardware timing, register maps, and electronic noise.'
    }
  },
  {
    id: 'uiux-designer',
    title: 'UI/UX Product Designer & Design Systems Lead',
    category: 'Design & Product',
    streamAffinity: ['Design', 'CSE', 'BCA', 'All Streams'],
    difficulty: 'Intermediate',
    demandLevel: 'High',
    averageSalaryUSD: '$102,000',
    averageSalaryINR: '₹10-20 LPA',
    recommendedDuration: '12-16 Weeks',
    icon: '🎨',
    accentColor: '#f43f5e',
    shortDescription: 'Design intuitive digital experiences, design systems, micro-interactions, user journeys, and wireframe prototypes in Figma.',
    coreSkills: ['Figma & Prototyping', 'User Research & Persona Building', 'Information Architecture', 'Design Systems (Tokens, Components)', 'Wireframing & Usability Testing', 'HTML/CSS Basics', 'Accessibility (WCAG 2.1)'],
    topTools: ['Figma', 'FigJam', 'Framer', 'Notion', 'Lottie / Rive', 'Maze'],
    topCompanies: ['Apple', 'Airbnb', 'Figma', 'Linear', 'Notion', 'Google'],
    learningResources: [
      { name: 'Figma Learn Hub', url: 'https://help.figma.com/hc/en-us' },
      { name: 'Nielsen Norman Group UX Articles', url: 'https://www.nngroup.com' },
      { name: 'Refactoring UI Book & Tutorials', url: 'https://www.refactoringui.com' },
      { name: 'roadmap.sh / UX Design', url: 'https://roadmap.sh/ux-design' }
    ]
  },
  {
    id: 'blockchain-web3',
    title: 'Blockchain & Web3 Smart Contract Engineer',
    category: 'Web3 & Distributed',
    streamAffinity: ['CSE', 'IT', 'Math & Cryptography'],
    difficulty: 'Advanced',
    demandLevel: 'High',
    averageSalaryUSD: '$130,000',
    averageSalaryINR: '₹18-35 LPA',
    recommendedDuration: '18-22 Weeks',
    icon: '🔗',
    accentColor: '#f59e0b',
    shortDescription: 'Develop secure smart contracts in Solidity, design decentralized protocols (DeFi/NFT), and perform EVM bytecode audits.',
    coreSkills: ['Solidity', 'Ethereum Virtual Machine (EVM)', 'Hardhat / Foundry', 'Ethers.js / Viem', 'Smart Contract Security & Auditing', 'Web3 Frontend Integration', 'Cryptography Basics', 'Git'],
    topTools: ['Foundry', 'Hardhat', 'Remix IDE', 'Metamask', 'Slither', 'Infura/Alchemy'],
    topCompanies: ['Consensys', 'Polygon', 'Uniswap Labs', 'Chainlink', 'Coinbase', 'Binance'],
    learningResources: [
      { name: 'CryptoZombies Interactive Solidity', url: 'https://cryptozombies.io' },
      { name: 'Cyfrin Updraft Smart Contract Courses', url: 'https://updraft.cyfrin.io' },
      { name: 'roadmap.sh / Blockchain', url: 'https://roadmap.sh/blockchain' }
    ]
  },
  {
    id: 'data-engineer',
    title: 'Big Data & ETL Pipeline Engineer',
    category: 'Data Science',
    streamAffinity: ['CSE', 'IT', 'Data Science'],
    difficulty: 'Advanced',
    demandLevel: 'Extremely High',
    averageSalaryUSD: '$126,000',
    averageSalaryINR: '₹16-30 LPA',
    recommendedDuration: '18-22 Weeks',
    icon: '🚰',
    accentColor: '#06b6d4',
    shortDescription: 'Build high-throughput streaming architectures, ETL data pipelines, lakehouses, and real-time Kafka consumers.',
    coreSkills: ['Python & Scala / Java', 'Advanced SQL & Data Modeling', 'Apache Spark', 'Apache Kafka / Flink', 'Airflow Orchestration', 'Snowflake / Databricks / Delta Lake', 'Docker & Cloud Storage'],
    topTools: ['Apache Spark', 'Kafka', 'Apache Airflow', 'dbt', 'Databricks', 'AWS S3 / Athena'],
    topCompanies: ['Uber', 'Netflix', 'Palantir', 'Snowflake', 'Databricks', 'Apple'],
    learningResources: [
      { name: 'Data Engineering Zoomcamp (Free)', url: 'https://github.com/DataTalksClub/data-engineering-zoomcamp' },
      { name: 'Apache Spark Official Programming Guide', url: 'https://spark.apache.org/docs/latest/' },
      { name: 'roadmap.sh / Data Engineer', url: 'https://roadmap.sh/data-engineer' }
    ]
  },
  {
    id: 'robotics-vision',
    title: 'Robotics & Computer Vision Engineer',
    category: 'Hardware & IoT',
    streamAffinity: ['Mechanical', 'ECE', 'CSE', 'Mechatronics'],
    difficulty: 'Advanced',
    demandLevel: 'High',
    averageSalaryUSD: '$125,000',
    averageSalaryINR: '₹15-32 LPA',
    recommendedDuration: '20-24 Weeks',
    icon: '🤖',
    accentColor: '#ec4899',
    shortDescription: 'Develop spatial perception algorithms, robot operating system (ROS2) nodes, kinematic path planning, and autonomous navigation.',
    coreSkills: ['Modern C++ & Python', 'ROS2 (Robot Operating System)', 'OpenCV & Computer Vision', 'Kinematics & State Estimation (Kalman Filter)', 'SLAM & Path Planning', 'Sensor Fusion (LiDAR, Camera, IMU)', 'Linux'],
    topTools: ['ROS2 Humble', 'Gazebo Simulator', 'OpenCV', 'RViz', 'Eigen Library', 'Ubuntu Linux'],
    topCompanies: ['Boston Dynamics', 'Tesla Autopilot', 'DJI', 'Skydio', 'Waymo', 'iRobot'],
    learningResources: [
      { name: 'Articulated Robotics ROS2 Tutorials', url: 'https://articulatedrobotics.xyz' },
      { name: 'OpenCV Official Python Tutorials', url: 'https://docs.opencv.org' },
      { name: 'MIT 6.801 Machine Vision Lectures', url: 'https://ocw.mit.edu' }
    ],
    streamBridgeAdvice: {
      'Mechanical': 'Your mastery of 3D vectors, kinematics, rigid-body physics, and CAD geometry makes robotics an ideal high-paying destination.'
    }
  }
];

const SkillPathAPI = {
  // Check backend server availability
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
      return null;
    }
  },

  // Get full career catalog (API or fallback)
  async getCareers() {
    try {
      const response = await fetch(`${API_BASE_URL}/careers`, {
        headers: { 'Accept': 'application/json' }
      });
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          return data;
        }
      }
    } catch (e) {}
    return CAREER_CATALOG;
  },

  // Get single career track by ID or title
  async getCareerById(idOrTitle) {
    const catalog = await this.getCareers();
    const query = String(idOrTitle).toLowerCase().trim();
    return catalog.find(c => c.id === query || c.title.toLowerCase().includes(query)) || catalog[0];
  },

  // Register student and receive comprehensive skill gap & roadmap analysis
  async registerStudent(studentData) {
    const token = typeof AuthService !== 'undefined' ? AuthService.getToken() : null;
    if (!token) {
      throw new Error('Please sign in to synthesize and save your student roadmap.');
    }

    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    const response = await fetch(`${API_BASE_URL}/students`, {
      method: 'POST',
      headers,
      body: JSON.stringify(studentData)
    });
    
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || errData.message || `Server returned ${response.status}: Failed to synthesize roadmap`);
    }

    const result = await response.json();
    return result;
  },

  // Real-time analysis preview without requiring database persistence
  async analyzeSkills(studentData) {
    const token = typeof AuthService !== 'undefined' ? AuthService.getToken() : null;
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/analyze`, {
        method: 'POST',
        headers,
        body: JSON.stringify(studentData)
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {}
    return this.synthesizeAnalysis(studentData, true);
  },

  // Core intelligence synthesis algorithm (Stream matching, Gap Benchmarking, Milestone Generation)
  synthesizeAnalysis(student, isPreviewOnly = false) {
    const rawSkills = student.skills || '';
    const skillsList = Array.isArray(rawSkills) 
      ? rawSkills 
      : rawSkills.split(',').map(s => s.trim()).filter(Boolean);
    
    const skillsNormalized = skillsList.map(s => s.toLowerCase());
    const careerQuery = (student.careerGoal || '').toLowerCase();
    const studentBranch = student.branch || 'Engineering';

    // Find best matching role
    let matchedCareer = CAREER_CATALOG.find(c => 
      c.title.toLowerCase().includes(careerQuery) || 
      c.id.toLowerCase() === careerQuery
    ) || CAREER_CATALOG[0];

    const requiredSkills = matchedCareer.coreSkills;
    const acquiredSkills = [];
    const missingSkills = [];

    requiredSkills.forEach(req => {
      const reqLower = req.toLowerCase();
      const hasSkill = skillsNormalized.some(s => {
        if (s === reqLower) return true;
        if (reqLower.includes(s) && s.length >= 3) return true;
        if (s.includes(reqLower)) return true;
        // Check slash aliases e.g. "React / Next.js"
        if (reqLower.includes('/')) {
          return reqLower.split('/').some(part => part.trim() === s || s.includes(part.trim()));
        }
        // Check ampersand aliases e.g. "SQL & RDBMS"
        if (reqLower.includes('&')) {
          return reqLower.split('&').some(part => part.trim() === s || s.includes(part.trim()));
        }
        return false;
      });

      if (hasSkill) {
        acquiredSkills.push(req);
      } else {
        missingSkills.push(req);
      }
    });

    // Score calculation
    const basePct = requiredSkills.length > 0 ? (acquiredSkills.length / requiredSkills.length) : 0.5;
    const cgpaBonus = student.cgpa ? Math.min(10, Math.max(0, (Number(student.cgpa) - 7.0) * 3)) : 5;
    const coursesCount = (student.coursework || []).length;
    const courseBonus = Math.min(10, coursesCount * 2);
    
    let rawScore = Math.round((basePct * 80) + cgpaBonus + courseBonus);
    const readinessScore = Math.min(98, Math.max(20, rawScore));

    // Milestone roadmap synthesis
    const roadmap = [
      {
        stepNumber: 1,
        title: 'Phase 1: Core Foundation & Language Mastery',
        duration: '4-5 Weeks',
        description: `Solidify core programming syntax, computational thinking, and algorithmic fundamentals for ${matchedCareer.title}.`,
        topics: [
          `${requiredSkills[0] || 'Core Syntax'} Fundamentals & Best Practices`,
          'Algorithmic Complexity (Big-O Analysis)',
          'Data Structures & Memory Models',
          'Git Version Control & Clean Code Standards'
        ],
        status: acquiredSkills.includes(requiredSkills[0]) ? 'Completed / Strong' : 'Priority Focus'
      },
      {
        stepNumber: 2,
        title: 'Phase 2: Frameworks, Architecture & Data Persistence',
        duration: '4-6 Weeks',
        description: `Master high-productivity frameworks, schema modeling, and backend/frontend state flows.`,
        topics: [
          `${requiredSkills[1] || 'Framework Core'} Architecture & State`,
          `${requiredSkills[2] || 'Database & Persistence'} Query Optimization & Indexing`,
          'Secure RESTful / GraphQL API Contracts',
          'Automated Unit & Integration Testing'
        ],
        status: 'In Progress'
      },
      {
        stepNumber: 3,
        title: 'Phase 3: Production Engineering & Capstone Building',
        duration: '4-6 Weeks',
        description: `Build full-scale cloud-native projects with containerization, caching, and CI/CD pipelines.`,
        topics: [
          'Docker Containerization & Multi-stage Builds',
          'Microservices / Cloud Architecture & Auth (JWT/OAuth)',
          'High-Throughput Caching & Rate Limiting',
          'End-to-End Capstone Project Deployment'
        ],
        status: 'Upcoming'
      },
      {
        stepNumber: 4,
        title: 'Phase 4: Interview Mastery & Portfolio Polish',
        duration: '3-4 Weeks',
        description: `Crack technical coding rounds, behavioral STAR stories, system design interviews, and ATS resume benchmarking.`,
        topics: [
          'High-Frequency LeetCode & Problem Solving Patterns',
          'System Design: Scalability, Caching, Load Balancers',
          'Live Portfolio Showcase & GitHub Readme Polishing',
          'Mock Technical Interviews & Behavioral Pitch'
        ],
        status: 'Upcoming'
      }
    ];

    // Recommended Capstones
    const projects = [
      `Tier 1 Starter: Modular ${matchedCareer.title} CRUD Application with Authentication & Automated Tests`,
      `Tier 2 Production: Scalable Real-time Platform with WebSockets, Cloud Storage & CI/CD Pipeline`,
      `Tier 3 Capstone: High-Concurrency Distributed System with Caching, Message Queues & Monitoring Metrics`
    ];

    // Certifications
    const certs = [
      `Industry Certificate: ${matchedCareer.category} Professional Assessment`,
      `Cloud Certification: AWS / Azure Associate Practitioner`,
      `Open Source Contribution: Submit 3 Verified PRs to Production Repositories`
    ];

    // Branch specific advice
    const branchKey = Object.keys(matchedCareer.streamBridgeAdvice || {}).find(k => studentBranch.toUpperCase().includes(k)) || 'Default';
    const streamAdvice = (matchedCareer.streamBridgeAdvice && matchedCareer.streamBridgeAdvice[branchKey]) || 
      `As a ${studentBranch} student, focus on bridging the gap between theoretical classroom coursework and real-world production engineering through hands-on GitHub projects.`;

    const result = {
      student: {
        ...student,
        id: student.id || 'std_' + Date.now(),
        skills: skillsList.join(', ')
      },
      careerGoal: matchedCareer.title,
      matchedCareer,
      readinessScore,
      missingSkills,
      acquiredSkills,
      streamAdvice,
      roadmap,
      recommendedProjects: projects,
      recommendedCertifications: certs,
      learningResources: matchedCareer.learningResources || [],
      summary: `AI Roadmap for ${student.name || 'Student'} (${studentBranch}): ${acquiredSkills.length} verified strengths, ${missingSkills.length} priority gaps. Overall Market Readiness Score: ${readinessScore}%.`
    };

    if (!isPreviewOnly) {
      sessionStorage.setItem('currentAnalysis', JSON.stringify(result));
      const savedRoadmaps = JSON.parse(localStorage.getItem('skillpath_saved_roadmaps') || '[]');
      const filtered = savedRoadmaps.filter(r => r.student?.email !== result.student.email || r.careerGoal !== result.careerGoal);
      filtered.unshift({
        id: result.student.id,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        student: result.student,
        careerGoal: result.careerGoal,
        readinessScore: result.readinessScore,
        missingCount: result.missingSkills.length,
        acquiredCount: result.acquiredSkills.length
      });
      localStorage.setItem('skillpath_saved_roadmaps', JSON.stringify(filtered.slice(0, 20)));
    }

    return result;
  },

  // Stream & Passion Recommendation Matcher
  recommendCareerFromStream(stream, interest) {
    const streamNormalized = (stream || '').toLowerCase();
    const interestNormalized = (interest || '').toLowerCase();

    const scored = CAREER_CATALOG.map(career => {
      let matchScore = 50;

      // Stream affinity
      if (career.streamAffinity.some(a => a === 'All Streams' || a === 'All Engineering' || streamNormalized.includes(a.toLowerCase()))) {
        matchScore += 25;
      }
      
      // Interest match
      const titleLower = career.title.toLowerCase();
      const catLower = career.category.toLowerCase();
      const descLower = career.shortDescription.toLowerCase();

      if (titleLower.includes(interestNormalized) || catLower.includes(interestNormalized) || descLower.includes(interestNormalized)) {
        matchScore += 25;
      }

      return {
        career,
        matchPercentage: Math.min(98, matchScore)
      };
    });

    return scored.sort((a, b) => b.matchPercentage - a.matchPercentage);
  },

  // AI Resume & ATS Keyword Matcher
  evaluateResumeText(resumeText, targetCareerId) {
    const textLower = (resumeText || '').toLowerCase();
    const career = CAREER_CATALOG.find(c => c.id === targetCareerId || c.title.toLowerCase().includes(targetCareerId.toLowerCase())) || CAREER_CATALOG[0];
    
    const foundKeywords = [];
    const missingKeywords = [];

    career.coreSkills.forEach(skill => {
      const sLower = skill.toLowerCase();
      if (textLower.includes(sLower)) {
        foundKeywords.push(skill);
      } else {
        missingKeywords.push(skill);
      }
    });

    const atsScore = Math.round((foundKeywords.length / career.coreSkills.length) * 100);

    return {
      targetRole: career.title,
      atsScore,
      foundKeywords,
      missingKeywords,
      actionableTips: [
        `Quantify achievements using metrics (e.g. "Optimized API latency by 35% using Redis caching").`,
        `Explicitly include high-frequency keywords: ${missingKeywords.slice(0, 3).join(', ') || 'Docker, System Design'}.`,
        `Include live URLs to your GitHub repository and deployed demo application.`
      ]
    };
  }
};

