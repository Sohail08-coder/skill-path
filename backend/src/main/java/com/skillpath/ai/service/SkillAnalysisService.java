package com.skillpath.ai.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.stereotype.Service;

import com.skillpath.ai.model.AnalysisResult;
import com.skillpath.ai.model.RoadmapStep;
import com.skillpath.ai.model.Student;

@Service
public class SkillAnalysisService {

    public List<String> analyzeSkills(Student student) {
        AnalysisResult result = generateComprehensiveAnalysis(student);
        return result.getMissingSkills();
    }

    public AnalysisResult generateComprehensiveAnalysis(Student student) {
        String skillsInput = student.getSkills() != null ? student.getSkills().toLowerCase() : "";
        String career = student.getCareerGoal() != null ? student.getCareerGoal().toLowerCase() : "";

        List<String> requiredSkills = new ArrayList<>();
        List<RoadmapStep> roadmap = new ArrayList<>();
        List<String> recommendedProjects = new ArrayList<>();
        List<String> recommendedCertifications = new ArrayList<>();

        if (career.contains("software")) {
            requiredSkills = Arrays.asList("Java", "Data Structures & Algorithms", "SQL", "Git & GitHub", "Spring Boot", "REST APIs", "Docker");
            roadmap.add(new RoadmapStep(1, "Core Programming & DSA", "4-6 Weeks", "Master object-oriented programming, complexity analysis, and core data structures.", Arrays.asList("Java fundamentals", "Arrays & Strings", "Trees & Graphs", "Dynamic Programming"), ""));
            roadmap.add(new RoadmapStep(2, "Database & Backend Fundamentals", "3-4 Weeks", "Learn relational data modeling, query optimization, and transaction handling.", Arrays.asList("SQL syntax", "Normalization", "Indexing", "JPA / Hibernate"), ""));
            roadmap.add(new RoadmapStep(3, "Spring Boot & RESTful Services", "4-5 Weeks", "Build production-grade APIs, implement validation, security, and exception handling.", Arrays.asList("Spring MVC", "Spring Data JPA", "Spring Security", "Postman Testing"), ""));
            roadmap.add(new RoadmapStep(4, "DevOps & Cloud Deployment", "2-3 Weeks", "Containerize services and set up basic continuous integration pipelines.", Arrays.asList("Docker containerization", "GitHub Actions CI", "Cloud hosting (AWS/Render)"), ""));

            recommendedProjects = Arrays.asList(
                "Full Stack E-Commerce Platform with Spring Boot & Payment Gateway",
                "Scalable Microservices-based Task & Notification Engine",
                "High-Concurrency URL Shortener with Redis Caching"
            );
            recommendedCertifications = Arrays.asList(
                "Oracle Certified Professional: Java SE Developer",
                "Spring Certified Professional",
                "AWS Certified Developer - Associate"
            );
        } else if (career.contains("ai") || career.contains("ml")) {
            requiredSkills = Arrays.asList("Python", "Statistics & Linear Algebra", "Machine Learning", "Deep Learning", "TensorFlow / PyTorch", "Natural Language Processing", "MLOps");
            roadmap.add(new RoadmapStep(1, "Mathematical Foundation & Python", "4-5 Weeks", "Solidify Python scripting, NumPy, Pandas, linear algebra, and calculus.", Arrays.asList("NumPy & Pandas", "Multivariate Calculus", "Probability Distributions", "Data Preprocessing"), ""));
            roadmap.add(new RoadmapStep(2, "Classical Machine Learning", "4-6 Weeks", "Implement supervised and unsupervised learning algorithms and evaluate metrics.", Arrays.asList("Linear/Logistic Regression", "Decision Trees & Random Forests", "SVM", "Model Evaluation Metrics"), ""));
            roadmap.add(new RoadmapStep(3, "Deep Learning & Neural Networks", "5-7 Weeks", "Design convolutional and recurrent networks using modern deep learning frameworks.", Arrays.asList("PyTorch / TensorFlow", "CNNs for Computer Vision", "Transformers & Attention", "Fine-tuning LLMs"), ""));
            roadmap.add(new RoadmapStep(4, "Model Deployment & MLOps", "3-4 Weeks", "Package models behind REST endpoints and track model metrics in production.", Arrays.asList("FastAPI Model Serving", "Docker for ML", "MLflow Experiment Tracking", "HuggingFace Spaces"), ""));

            recommendedProjects = Arrays.asList(
                "Multimodal Sentiment & Intent Classifier with Fine-Tuned Transformer",
                "Real-time Object Detection and Tracking System with YOLO and OpenCV",
                "RAG-Powered AI Knowledge Assistant with LangChain and Vector DB"
            );
            recommendedCertifications = Arrays.asList(
                "DeepLearning.AI Deep Learning Specialization",
                "TensorFlow Developer Certificate",
                "AWS Certified Machine Learning - Specialty"
            );
        } else if (career.contains("data scientist")) {
            requiredSkills = Arrays.asList("Python", "SQL", "Statistics", "Machine Learning", "Pandas & Data Wrangling", "Data Visualization", "Big Data Analytics");
            roadmap.add(new RoadmapStep(1, "Exploratory Data Analysis & Statistics", "4-5 Weeks", "Extract insights, run hypothesis tests, and clean unstructured data.", Arrays.asList("Advanced Pandas", "Hypothesis Testing", "Seaborn/Plotly", "Statistical Inference"), ""));
            roadmap.add(new RoadmapStep(2, "Predictive Modeling & Feature Engineering", "4-5 Weeks", "Engineer predictive features and train baseline to ensemble models.", Arrays.asList("Scikit-Learn", "Feature Importance & Selection", "XGBoost & LightGBM", "Cross-Validation"), ""));
            roadmap.add(new RoadmapStep(3, "Big Data & Distributed Computing", "3-4 Weeks", "Work with scalable data pipelines and distributed compute frameworks.", Arrays.asList("PySpark", "SQL Window Functions", "Data Lakes", "ETL Pipelines"), ""));
            roadmap.add(new RoadmapStep(4, "Business Storytelling & Deployment", "2-3 Weeks", "Transform model outputs into executive dashboards and production workflows.", Arrays.asList("Streamlit / Dash Apps", "Executive Presentations", "A/B Testing Frameworks"), ""));

            recommendedProjects = Arrays.asList(
                "Customer Lifetime Value (LTV) Prediction & Churn Early-Warning System",
                "Algorithmic Trading & Financial Market Anomaly Detector",
                "End-to-End Housing Market Price Predictor with Interactive Streamlit Dashboard"
            );
            recommendedCertifications = Arrays.asList(
                "IBM Data Science Professional Certificate",
                "Google Advanced Data Analytics Certificate",
                "Microsoft Certified: Azure Data Scientist Associate"
            );
        } else if (career.contains("data analyst")) {
            requiredSkills = Arrays.asList("SQL", "Power BI / Tableau", "Excel (Advanced)", "Python", "Statistics", "Data Cleaning & Storytelling");
            roadmap.add(new RoadmapStep(1, "Advanced Excel & Data Foundations", "2-3 Weeks", "Master VLOOKUP, INDEX/MATCH, Pivot Tables, and automated macros.", Arrays.asList("Formulas & Modeling", "Power Query", "Pivot Tables & Charts"), ""));
            roadmap.add(new RoadmapStep(2, "Relational Databases & SQL Mastery", "3-4 Weeks", "Write complex queries, joins, aggregations, and window functions.", Arrays.asList("Joins & Subqueries", "Window Functions (ROW_NUMBER, RANK)", "CTEs & Views", "Data Cleaning in SQL"), ""));
            roadmap.add(new RoadmapStep(3, "BI Dashboards & Visualization", "3-4 Weeks", "Create interactive, decision-driving dashboards in Power BI or Tableau.", Arrays.asList("DAX Calculations", "Interactive Visuals", "KPI Tracking", "Data Modeling"), ""));
            roadmap.add(new RoadmapStep(4, "Python for Automated Analysis", "2-3 Weeks", "Automate reports and extract deeper statistical patterns using Python.", Arrays.asList("Pandas for data wrangling", "Matplotlib & Seaborn", "Automated Excel Reports"), ""));

            recommendedProjects = Arrays.asList(
                "Executive Sales & Profit Performance Dashboard with DAX & Power BI",
                "Healthcare Patient Wait-Time and Resource Utilization Analysis in SQL",
                "E-Commerce Customer Retention & Cohort Analysis Report"
            );
            recommendedCertifications = Arrays.asList(
                "Microsoft Certified: Power BI Data Analyst Associate (PL-300)",
                "Google Data Analytics Professional Certificate",
                "Tableau Desktop Specialist"
            );
        } else if (career.contains("web")) {
            requiredSkills = Arrays.asList("HTML5 & Modern CSS", "JavaScript (ES6+)", "React / Next.js", "Node.js & Express", "REST APIs", "SQL / NoSQL", "Git");
            roadmap.add(new RoadmapStep(1, "Modern Frontend Core", "3-4 Weeks", "Master semantic HTML, responsive flexbox/grid layouts, and modern CSS3.", Arrays.asList("Semantic HTML5", "Responsive Grid/Flexbox", "CSS Animations", "DOM Manipulation"), ""));
            roadmap.add(new RoadmapStep(2, "JavaScript & Modern Frameworks", "4-6 Weeks", "Build rich interactive UIs using React or Next.js with state management.", Arrays.asList("Async/Await & Promises", "React Hooks & State", "Component Architecture", "TailwindCSS"), ""));
            roadmap.add(new RoadmapStep(3, "Backend Server & Database", "4-5 Weeks", "Build robust server applications and integrate databases.", Arrays.asList("Node.js / Express or Spring Boot", "PostgreSQL / MongoDB", "Authentication (JWT / OAuth)", "REST API Design"), ""));
            roadmap.add(new RoadmapStep(4, "Full Stack Integration & Cloud", "2-3 Weeks", "Deploy full-stack web applications with automated testing and continuous deployment.", Arrays.asList("Vercel / Render Deployment", "End-to-End Testing", "Web Performance Optimization"), ""));

            recommendedProjects = Arrays.asList(
                "Collaborative Kanban Project Management App with Real-Time WebSockets",
                "Modern SaaS Landing Page & Subscription Dashboard with Stripe Billing",
                "Social Network Community Feed with Infinite Scroll & Instant Messaging"
            );
            recommendedCertifications = Arrays.asList(
                "Meta Front-End Developer Professional Certificate",
                "Meta Back-End Developer Professional Certificate",
                "freeCodeCamp Full Stack Developer Certification"
            );
        } else if (career.contains("cyber") || career.contains("security")) {
            requiredSkills = Arrays.asList("Computer Networking", "Linux Administration", "Ethical Hacking & Pentesting", "Security Operations (SIEM)", "Cryptography", "OWASP Top 10", "Network Security");
            roadmap.add(new RoadmapStep(1, "Networking & Linux Internals", "3-4 Weeks", "Learn TCP/IP stack, packet inspection, firewalls, and command-line Linux.", Arrays.asList("OSI Model & TCP/IP", "Wireshark Packet Analysis", "Linux Bash Scripting", "User Permissions"), ""));
            roadmap.add(new RoadmapStep(2, "Vulnerability Assessment & Web Security", "4-5 Weeks", "Identify and remediate security vulnerabilities in software and networks.", Arrays.asList("OWASP Top 10", "Burp Suite & Nmap", "SQL Injection & XSS Defense", "Penetration Testing Basics"), ""));
            roadmap.add(new RoadmapStep(3, "Security Operations & Incident Response", "4-5 Weeks", "Monitor logs, detect intrusions, and respond to threats using SIEM tools.", Arrays.asList("Splunk / ELK SIEM", "SOC Workflows", "Incident Response Runbooks", "Threat Intelligence"), ""));
            roadmap.add(new RoadmapStep(4, "Applied Cryptography & Cloud Security", "3-4 Weeks", "Implement encryption protocols and secure multi-tenant cloud environments.", Arrays.asList("Public Key Infrastructure (PKI)", "TLS/SSL Handshakes", "AWS IAM & Security Groups"), ""));

            recommendedProjects = Arrays.asList(
                "Enterprise SOC Homelab with Splunk, Snort IDS, and Active Directory Simulation",
                "Vulnerability Scanner & Automated Compliance Auditor CLI in Python",
                "Secure Web App with Multifactor Authentication & Rate Limiting Defense"
            );
            recommendedCertifications = Arrays.asList(
                "CompTIA Security+",
                "Certified Ethical Hacker (CEH) / eJPT",
                "Cisco Certified Support Technician (CCST) Cybersecurity"
            );
        } else if (career.contains("cloud") || career.contains("devops")) {
            requiredSkills = Arrays.asList("Linux", "Git & GitHub", "Docker", "Kubernetes", "CI/CD Pipelines", "Terraform (IaC)", "AWS / Azure", "Monitoring (Prometheus/Grafana)");
            roadmap.add(new RoadmapStep(1, "Linux & Cloud Fundamentals", "3-4 Weeks", "Build Linux fluency, shell scripting, and core cloud architecture principles.", Arrays.asList("Bash Scripting", "System Administration", "AWS Core Services (EC2, S3, VPC)", "IAM Policies"), ""));
            roadmap.add(new RoadmapStep(2, "Containerization & Orchestration", "4-5 Weeks", "Containerize distributed apps with Docker and orchestrate with Kubernetes.", Arrays.asList("Dockerfiles & Multi-stage Builds", "Docker Compose", "Kubernetes Pods, Services, Ingress", "Helm Charts"), ""));
            roadmap.add(new RoadmapStep(3, "Infrastructure as Code & CI/CD", "4-5 Weeks", "Automate infrastructure provisioning and deployment pipelines.", Arrays.asList("Terraform HCL", "GitHub Actions / GitLab CI", "Automated Testing Gates", "GitOps (ArgoCD)"), ""));
            roadmap.add(new RoadmapStep(4, "Observability & Site Reliability", "3-4 Weeks", "Implement centralized logging, metrics collection, and alerting systems.", Arrays.asList("Prometheus & Grafana", "ELK Stack / Loki", "SLOs / SLIs & Incident Management"), ""));

            recommendedProjects = Arrays.asList(
                "Zero-Downtime Microservices Deployment Pipeline on AWS EKS with ArgoCD",
                "Multi-Tier Cloud Infrastructure Provisioned Entirely with Terraform",
                "Automated Chaos Engineering & Observability Stack with Prometheus and Grafana"
            );
            recommendedCertifications = Arrays.asList(
                "AWS Certified Solutions Architect - Associate",
                "Certified Kubernetes Administrator (CKA)",
                "HashiCorp Certified: Terraform Associate"
            );
        } else {
            requiredSkills = Arrays.asList("Programming Fundamentals", "Data Structures & Algorithms", "Git & Version Control", "Databases (SQL)", "Problem Solving", "Software Design");
            roadmap.add(new RoadmapStep(1, "Computer Science Fundamentals", "4 Weeks", "Strengthen problem solving and algorithmic reasoning.", Arrays.asList("Core Language Syntax", "Algorithm Analysis", "Clean Code"), ""));
            roadmap.add(new RoadmapStep(2, "Application Development", "4 Weeks", "Build full software applications with persistent data layers.", Arrays.asList("Frameworks", "REST APIs", "Relational Databases"), ""));
            roadmap.add(new RoadmapStep(3, "Collaboration & Deployment", "3 Weeks", "Deploy live projects and learn collaborative software development practices.", Arrays.asList("Git Collaboration", "Cloud Hosting", "CI/CD Basics"), ""));

            recommendedProjects = Arrays.asList(
                "Full Stack Web Application with Authentication and Database Persistence",
                "Automated Data Scraping and Analytics Pipeline",
                "Open Source Contribution to Developer Tooling"
            );
            recommendedCertifications = Arrays.asList(
                "GitHub Foundations Certification",
                "AWS Certified Cloud Practitioner"
            );
        }

        List<String> missingSkills = new ArrayList<>();
        List<String> acquiredSkills = new ArrayList<>();

        for (String skill : requiredSkills) {
            String check = skill.toLowerCase();
            boolean has = false;

            if (check.contains("/")) {
                String[] parts = check.split("/");
                for (String p : parts) {
                    if (skillsInput.contains(p.trim())) {
                        has = true;
                        break;
                    }
                }
            } else if (check.contains("&")) {
                String[] parts = check.split("&");
                for (String p : parts) {
                    if (skillsInput.contains(p.trim())) {
                        has = true;
                        break;
                    }
                }
            } else {
                has = skillsInput.contains(check);
            }

            if (has) {
                acquiredSkills.add(skill);
            } else {
                missingSkills.add(skill);
            }
        }

        // Update status for roadmap steps
        for (RoadmapStep step : roadmap) {
            boolean anyMissing = false;
            for (String missing : missingSkills) {
                if (step.getDescription().toLowerCase().contains(missing.toLowerCase()) ||
                    step.getTitle().toLowerCase().contains(missing.toLowerCase())) {
                    anyMissing = true;
                    break;
                }
            }
            step.setStatus(anyMissing ? "Priority Focus" : "In Progress");
        }

        int total = requiredSkills.size();
        int acquired = acquiredSkills.size();
        int score = total > 0 ? (int) Math.round(((double) acquired / total) * 100) : 0;
        if (score < 15 && !acquiredSkills.isEmpty()) {
            score = 25;
        }

        String summary = String.format("Found %d acquired skills and %d key skill gaps for target role: %s. Overall readiness score: %d%%.",
                acquired, missingSkills.size(), student.getCareerGoal() != null ? student.getCareerGoal() : "General", score);

        return new AnalysisResult(student, student.getCareerGoal(), score, missingSkills, acquiredSkills,
                roadmap, recommendedProjects, recommendedCertifications, summary);
    }
}