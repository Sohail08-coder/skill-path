package com.skillpath.ai.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.skillpath.ai.model.CareerPath;

@Service
public class CareerCatalogService {

    private final List<CareerPath> careerCatalog = new ArrayList<>();

    public CareerCatalogService() {
        initCatalog();
    }

    private void initCatalog() {
        careerCatalog.add(new CareerPath(
            "software-developer",
            "Software Developer",
            "Software Engineering",
            "Design and build scalable server architectures, robust APIs, and enterprise enterprise services.",
            "Extremely High",
            "$110,000 / ₹12-25 LPA",
            "16-20 Weeks",
            Arrays.asList("Java", "Data Structures & Algorithms", "SQL", "Spring Boot", "REST APIs", "Git & GitHub"),
            Arrays.asList("IntelliJ IDEA", "Docker", "Postman", "MySQL", "Maven"),
            "☕",
            "#6366f1"
        ));

        careerCatalog.add(new CareerPath(
            "ai-ml-engineer",
            "AI / ML Engineer",
            "Artificial Intelligence",
            "Architect deep learning neural models, NLP transformers, and production-ready intelligent pipelines.",
            "Extremely High",
            "$130,000 / ₹18-35 LPA",
            "20-24 Weeks",
            Arrays.asList("Python", "Mathematics & Statistics", "Machine Learning", "Deep Learning", "TensorFlow / PyTorch", "Transformers & LLMs"),
            Arrays.asList("Jupyter", "PyTorch", "Hugging Face", "MLflow", "Docker"),
            "🤖",
            "#a855f7"
        ));

        careerCatalog.add(new CareerPath(
            "data-scientist",
            "Data Scientist",
            "Data Science",
            "Extract mathematical insights, build predictive classifiers, and power business-critical decisions.",
            "Very High",
            "$115,000 / ₹14-26 LPA",
            "16-18 Weeks",
            Arrays.asList("Python", "SQL", "Statistics", "Machine Learning", "Pandas", "Data Visualization"),
            Arrays.asList("Scikit-Learn", "Seaborn", "Streamlit", "SQL Workbench", "Tableau"),
            "🔬",
            "#06b6d4"
        ));

        careerCatalog.add(new CareerPath(
            "web-developer",
            "Full Stack Web Developer",
            "Web Development",
            "Craft modern user interfaces, reactive client applications, and resilient cloud-connected backends.",
            "Very High",
            "$100,000 / ₹10-20 LPA",
            "14-16 Weeks",
            Arrays.asList("HTML5 & CSS3", "JavaScript (ES6+)", "React / Next.js", "Node.js & Express", "REST APIs", "SQL / NoSQL"),
            Arrays.asList("VS Code", "Git", "TailwindCSS", "PostgreSQL", "Vercel"),
            "🌐",
            "#ec4899"
        ));

        careerCatalog.add(new CareerPath(
            "cloud-devops",
            "Cloud & DevOps Engineer",
            "Cloud Infrastructure",
            "Automate deployment pipelines, orchestrate Kubernetes clusters, and manage reliable infrastructure-as-code.",
            "Very High",
            "$125,000 / ₹15-30 LPA",
            "18-20 Weeks",
            Arrays.asList("Linux", "Git & GitHub", "Docker", "Kubernetes", "CI/CD Pipelines", "Terraform", "AWS / Azure"),
            Arrays.asList("Docker", "Kubernetes", "Terraform", "GitHub Actions", "Prometheus"),
            "☁️",
            "#10b981"
        ));

        careerCatalog.add(new CareerPath(
            "cybersecurity",
            "Cybersecurity Analyst",
            "Information Security",
            "Safeguard digital infrastructure, conduct vulnerability testing, and protect systems from cyber exploits.",
            "Very High",
            "$112,000 / ₹12-24 LPA",
            "16-18 Weeks",
            Arrays.asList("Computer Networking", "Linux Administration", "Ethical Hacking", "OWASP Top 10", "Security Operations (SIEM)", "Cryptography"),
            Arrays.asList("Wireshark", "Burp Suite", "Nmap", "Splunk", "Metasploit"),
            "🛡️",
            "#f59e0b"
        ));

        careerCatalog.add(new CareerPath(
            "data-analyst",
            "Data Analyst",
            "Business Intelligence",
            "Turn complex database metrics into interactive KPI dashboards and strategic growth insights.",
            "High",
            "$85,000 / ₹8-16 LPA",
            "10-12 Weeks",
            Arrays.asList("SQL", "Power BI / Tableau", "Advanced Excel", "Python", "Data Storytelling", "Statistics"),
            Arrays.asList("Power BI", "Excel", "Tableau", "PostgreSQL", "Python Pandas"),
            "📊",
            "#3b82f6"
        ));

        careerCatalog.add(new CareerPath(
            "mobile-developer",
            "Mobile App Developer",
            "Mobile Engineering",
            "Build high-performance, fluid mobile applications for iOS and Android using modern cross-platform tech.",
            "High",
            "$98,000 / ₹10-18 LPA",
            "14-16 Weeks",
            Arrays.asList("Flutter / Dart", "Kotlin or Swift", "Mobile UI Architecture", "REST APIs", "State Management", "SQLite / Firebase"),
            Arrays.asList("Android Studio", "Xcode", "Flutter SDK", "Firebase", "Figma"),
            "📱",
            "#14b8a6"
        ));
    }

    public List<CareerPath> getAllCareers() {
        return careerCatalog;
    }

    public Optional<CareerPath> getCareerById(String id) {
        return careerCatalog.stream()
            .filter(c -> c.getId().equalsIgnoreCase(id) || c.getTitle().toLowerCase().contains(id.toLowerCase()))
            .findFirst();
    }
}
