package com.skillpath.ai.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.skillpath.ai.model.AnalysisResult;
import com.skillpath.ai.model.AssessmentRecord;
import com.skillpath.ai.model.Student;
import com.skillpath.ai.model.User;
import com.skillpath.ai.repository.AssessmentRecordRepository;
import com.skillpath.ai.repository.StudentRepository;
import com.skillpath.ai.repository.UserRepository;
import com.skillpath.ai.service.SkillAnalysisService;

@RestController
@RequestMapping("/api")
public class StudentRestController {

    private static final Logger logger = LoggerFactory.getLogger(StudentRestController.class);

    private final StudentRepository studentRepository;
    private final AssessmentRecordRepository assessmentRecordRepository;
    private final UserRepository userRepository;
    private final SkillAnalysisService skillAnalysisService;

    public StudentRestController(StudentRepository studentRepository,
                                 AssessmentRecordRepository assessmentRecordRepository,
                                 UserRepository userRepository,
                                 SkillAnalysisService skillAnalysisService) {
        this.studentRepository = studentRepository;
        this.assessmentRecordRepository = assessmentRecordRepository;
        this.userRepository = userRepository;
        this.skillAnalysisService = skillAnalysisService;
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "SkillPath-AI REST API");
        response.put("version", "2.1.0");
        response.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(response);
    }

    /**
     * Synthesizes and persists a personalized skill gap analysis and roadmap for the authenticated student.
     */
    @PostMapping("/students")
    @Transactional
    public ResponseEntity<?> registerAndAnalyze(@RequestBody Student student) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Authentication required"));
        }

        if (student == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Student payload is required"));
        }

        if (student.getCareerGoal() == null || student.getCareerGoal().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Target career goal is required"));
        }

        if (student.getCgpa() < 0.0 || student.getCgpa() > 10.0) {
            return ResponseEntity.badRequest().body(Map.of("error", "CGPA must be between 0.0 and 10.0"));
        }

        String email = auth.getName();
        User currentUser = userRepository.findByEmail(email.toLowerCase()).orElse(null);
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Authenticated user account not found"));
        }

        // Bind student email to authenticated user
        student.setEmail(currentUser.getEmail());
        if (student.getName() == null || student.getName().trim().isEmpty()) {
            student.setName(currentUser.getName());
        }

        Student savedStudent = studentRepository.save(student);
        AnalysisResult result = skillAnalysisService.generateComprehensiveAnalysis(savedStudent);

        // Persist assessment record linked to authenticated user ID
        AssessmentRecord record = new AssessmentRecord();
        record.setUserId(currentUser.getId());
        record.setUserEmail(currentUser.getEmail());
        record.setCareerGoal(savedStudent.getCareerGoal());
        record.setBranch(savedStudent.getBranch());
        record.setYear(savedStudent.getYear());
        record.setCgpa(savedStudent.getCgpa());
        record.setReadinessScore(result.getReadinessScore());
        record.setAcquiredSkills(String.join(", ", result.getAcquiredSkills()));
        record.setMissingSkills(String.join(", ", result.getMissingSkills()));
        record.setSummary(result.getSummary());
        AssessmentRecord savedRecord = assessmentRecordRepository.save(record);
        result.setRecordId(savedRecord.getId());

        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

    /**
     * Returns the authenticated student's previous assessment and roadmap history.
     */
    @GetMapping("/students/my-history")
    @Transactional(readOnly = true)
    public ResponseEntity<?> getMyAssessmentHistory() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Authentication required"));
        }

        String email = auth.getName();
        User currentUser = userRepository.findByEmail(email.toLowerCase()).orElse(null);

        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "User not found"));
        }

        List<AssessmentRecord> history = assessmentRecordRepository.findByUserIdOrderByCreatedAtDesc(currentUser.getId());
        return ResponseEntity.ok(history);
    }

    /**
     * Retrieves a single assessment record by ID with strict ownership verification.
     */
    @GetMapping("/students/assessment/{id}")
    @Transactional(readOnly = true)
    public ResponseEntity<?> getAssessmentById(@PathVariable Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Authentication required"));
        }

        String email = auth.getName();
        User currentUser = userRepository.findByEmail(email.toLowerCase()).orElse(null);
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "User not found"));
        }

        AssessmentRecord record = assessmentRecordRepository.findById(id).orElse(null);
        if (record == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Assessment record not found"));
        }

        boolean isAdmin = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        if (!isAdmin && !record.getUserId().equals(currentUser.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Access denied: You do not own this assessment record"));
        }

        return ResponseEntity.ok(record);
    }

    /**
     * Deletes a single assessment record by ID with strict ownership verification.
     */
    @org.springframework.web.bind.annotation.DeleteMapping("/students/assessment/{id}")
    @Transactional
    public ResponseEntity<?> deleteAssessmentById(@PathVariable Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Authentication required"));
        }

        String email = auth.getName();
        User currentUser = userRepository.findByEmail(email.toLowerCase()).orElse(null);
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "User not found"));
        }

        AssessmentRecord record = assessmentRecordRepository.findById(id).orElse(null);
        if (record == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Assessment record not found"));
        }

        boolean isAdmin = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        if (!isAdmin && !record.getUserId().equals(currentUser.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Access denied: You do not own this assessment record"));
        }

        assessmentRecordRepository.delete(record);
        return ResponseEntity.ok(Map.of("success", true, "message", "Assessment record deleted successfully"));
    }

    /**
     * Updates milestone completion status on an assessment record with strict ownership verification.
     */
    @PostMapping("/students/update-progress")
    @Transactional
    public ResponseEntity<?> updateMilestoneProgress(@RequestBody Map<String, Object> payload) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Authentication required"));
        }

        String email = auth.getName();
        User currentUser = userRepository.findByEmail(email.toLowerCase()).orElse(null);
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "User not found"));
        }

        Object recordIdObj = payload.get("recordId");
        if (recordIdObj == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "recordId is required"));
        }

        Long recordId;
        try {
            recordId = Long.valueOf(recordIdObj.toString());
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid recordId format"));
        }

        AssessmentRecord record = assessmentRecordRepository.findById(recordId).orElse(null);
        if (record == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Assessment record not found"));
        }

        // Strict ownership verification: Deny immediately if record does not belong to caller
        if (!record.getUserId().equals(currentUser.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Access denied: Cannot modify another student's record"));
        }

        Object topicsObj = payload.get("completedTopics");
        if (topicsObj != null) {
            record.setCompletedMilestoneTopics(topicsObj.toString());
        }

        if (payload.get("readinessScore") != null) {
            try {
                int updatedScore = Integer.parseInt(payload.get("readinessScore").toString());
                record.setReadinessScore(Math.min(100, Math.max(0, updatedScore)));
            } catch (NumberFormatException ignored) {}
        }

        assessmentRecordRepository.save(record);
        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "Milestone progress updated successfully",
            "recordId", record.getId(),
            "readinessScore", record.getReadinessScore()
        ));
    }

    /**
     * Admin only: Returns all student records.
     */
    @GetMapping("/students")
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional(readOnly = true)
    public ResponseEntity<List<Student>> getAllStudents() {
        return ResponseEntity.ok(studentRepository.findAll());
    }

    /**
     * Returns student analysis by ID with ownership verification.
     */
    @GetMapping("/students/{id}")
    @Transactional(readOnly = true)
    public ResponseEntity<?> getStudentAnalysis(@PathVariable Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Authentication required"));
        }

        String email = auth.getName();
        Student target = studentRepository.findById(id).orElse(null);

        if (target == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Student record not found"));
        }

        // Ownership check: Student can only access their own record unless admin
        boolean isAdmin = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        if (!isAdmin && (target.getEmail() == null || !target.getEmail().equalsIgnoreCase(email))) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Access denied to this student record"));
        }

        return ResponseEntity.ok(skillAnalysisService.generateComprehensiveAnalysis(target));
    }

    /**
     * Computes skill gap analysis without persistence.
     */
    @PostMapping("/analyze")
    public ResponseEntity<AnalysisResult> analyzeWithoutSaving(@RequestBody Student student) {
        AnalysisResult result = skillAnalysisService.generateComprehensiveAnalysis(student);
        return ResponseEntity.ok(result);
    }
}
