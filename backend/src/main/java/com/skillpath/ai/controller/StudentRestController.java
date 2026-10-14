package com.skillpath.ai.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.skillpath.ai.model.AnalysisResult;
import com.skillpath.ai.model.Student;
import com.skillpath.ai.repository.StudentRepository;
import com.skillpath.ai.service.SkillAnalysisService;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class StudentRestController {

    private final StudentRepository studentRepository;
    private final SkillAnalysisService skillAnalysisService;

    // Fail-safe in-memory cache ensures endpoints work seamlessly even if MySQL is offline
    private final Map<Long, Student> memoryStudentStore = new ConcurrentHashMap<>();
    private final AtomicLong idSequence = new AtomicLong(100);

    public StudentRestController(StudentRepository studentRepository,
                                 SkillAnalysisService skillAnalysisService) {
        this.studentRepository = studentRepository;
        this.skillAnalysisService = skillAnalysisService;

        // Seed sample student
        Student sample = new Student();
        sample.setId(1L);
        sample.setName("Alex Morgan");
        sample.setEmail("alex.morgan@university.edu");
        sample.setBranch("Computer Science");
        sample.setYear("3rd Year");
        sample.setCgpa(8.7);
        sample.setSkills("Java, SQL, Git & GitHub, Data Structures & Algorithms");
        sample.setInterests("Web Systems, Cloud Architecture");
        sample.setProjects("Full Stack Library Manager");
        sample.setCertifications("NPTEL Java Programming");
        sample.setCareerGoal("Software Developer");
        memoryStudentStore.put(sample.getId(), sample);
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "SkillPath-AI REST API");
        response.put("version", "2.0.0");
        response.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/students")
    public ResponseEntity<AnalysisResult> registerAndAnalyze(@RequestBody Student student) {
        Student savedStudent;
        try {
            savedStudent = studentRepository.save(student);
        } catch (Exception e) {
            // DB offline fallback
            if (student.getId() == null) {
                student.setId(idSequence.incrementAndGet());
            }
            savedStudent = student;
        }

        memoryStudentStore.put(savedStudent.getId(), savedStudent);
        AnalysisResult result = skillAnalysisService.generateComprehensiveAnalysis(savedStudent);
        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

    @GetMapping("/students")
    public ResponseEntity<List<Student>> getAllStudents() {
        try {
            List<Student> dbStudents = studentRepository.findAll();
            if (!dbStudents.isEmpty()) {
                return ResponseEntity.ok(dbStudents);
            }
        } catch (Exception ignored) {}

        return ResponseEntity.ok(new ArrayList<>(memoryStudentStore.values()));
    }

    @GetMapping("/students/{id}")
    public ResponseEntity<AnalysisResult> getStudentAnalysis(@PathVariable Long id) {
        Student target = null;
        try {
            target = studentRepository.findById(id).orElse(null);
        } catch (Exception ignored) {}

        if (target == null) {
            target = memoryStudentStore.get(id);
        }

        if (target != null) {
            return ResponseEntity.ok(skillAnalysisService.generateComprehensiveAnalysis(target));
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/analyze")
    public ResponseEntity<AnalysisResult> analyzeWithoutSaving(@RequestBody Student student) {
        AnalysisResult result = skillAnalysisService.generateComprehensiveAnalysis(student);
        return ResponseEntity.ok(result);
    }
}
