package com.skillpath.ai;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import com.skillpath.ai.model.User;
import com.skillpath.ai.repository.AssessmentRecordRepository;
import com.skillpath.ai.repository.StudentRepository;
import com.skillpath.ai.repository.UserRepository;
import com.skillpath.ai.security.JwtTokenProvider;

@SpringBootTest
public class StudentRestControllerTest {

    @Autowired
    private WebApplicationContext context;

    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private AssessmentRecordRepository assessmentRecordRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    private User testStudent;
    private String jwtToken;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(context)
                .apply(springSecurity())
                .build();

        assessmentRecordRepository.deleteAll();
        studentRepository.deleteAll();
        userRepository.deleteAll();

        testStudent = new User();
        testStudent.setName("Syed Sohail");
        testStudent.setEmail("sohail.student@skillpath.ai");
        testStudent.setPassword(passwordEncoder.encode("secretPass123"));
        testStudent.setBranch("Computer Science & Engineering");
        testStudent.setYear("3rd Year");
        testStudent.setRole("STUDENT");
        testStudent = userRepository.save(testStudent);

        jwtToken = jwtTokenProvider.generateToken(testStudent);
    }

    @Test
    void testRegisterAndAnalyzeAuthenticated() throws Exception {
        String studentJson = """
            {
                "name": "Syed Sohail",
                "branch": "Computer Science & Engineering",
                "year": "3rd Year",
                "cgpa": 8.85,
                "careerGoal": "Software Developer (Java / Cloud)",
                "skills": "Java, SQL, Git & GitHub"
            }
        """;

        mockMvc.perform(post("/api/students")
                .header("Authorization", "Bearer " + jwtToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(studentJson))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.readinessScore").isNumber())
                .andExpect(jsonPath("$.roadmap").isArray())
                .andExpect(jsonPath("$.acquiredSkills").isArray())
                .andExpect(jsonPath("$.missingSkills").isArray());

        // Verify assessment record was persisted in database
        var history = assessmentRecordRepository.findByUserIdOrderByCreatedAtDesc(testStudent.getId());
        assertNotNull(history);
        assertFalse(history.isEmpty());
    }

    @Test
    void testGetMyAssessmentHistory() throws Exception {
        // Run an assessment first
        String studentJson = """
            {
                "name": "Syed Sohail",
                "branch": "Computer Science & Engineering",
                "year": "3rd Year",
                "cgpa": 8.85,
                "careerGoal": "Software Developer (Java / Cloud)",
                "skills": "Java, SQL, Git & GitHub"
            }
        """;

        mockMvc.perform(post("/api/students")
                .header("Authorization", "Bearer " + jwtToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(studentJson))
                .andExpect(status().isCreated());

        mockMvc.perform(get("/api/students/my-history")
                .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].careerGoal").value("Software Developer (Java / Cloud)"));
    }

    @Test
    void testUnauthorizedStudentAccessRejected() throws Exception {
        mockMvc.perform(get("/api/students/my-history"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void testCrossUserDataIsolation() throws Exception {
        // Create an assessment for Student A
        String studentJsonA = """
            {
                "name": "Syed Sohail",
                "branch": "Computer Science & Engineering",
                "year": "3rd Year",
                "cgpa": 8.85,
                "careerGoal": "Software Developer (Java / Cloud)",
                "skills": "Java, SQL, Git & GitHub"
            }
        """;

        mockMvc.perform(post("/api/students")
                .header("Authorization", "Bearer " + jwtToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(studentJsonA))
                .andExpect(status().isCreated());

        // Create Student B
        User studentB = new User();
        studentB.setName("Rahul Kumar");
        studentB.setEmail("rahul.b@skillpath.ai");
        studentB.setPassword(passwordEncoder.encode("secretPass456"));
        studentB.setBranch("Information Technology");
        studentB.setYear("2nd Year");
        studentB.setRole("STUDENT");
        studentB = userRepository.save(studentB);

        String jwtTokenB = jwtTokenProvider.generateToken(studentB);

        // Student B calls /api/students/my-history -> should be empty (cannot see Student A's history)
        mockMvc.perform(get("/api/students/my-history")
                .header("Authorization", "Bearer " + jwtTokenB))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(0));
    }

    @Test
    void testProgressUpdatePersistence() throws Exception {
        // Run initial assessment
        String studentJson = """
            {
                "name": "Syed Sohail",
                "branch": "Computer Science & Engineering",
                "year": "3rd Year",
                "cgpa": 8.85,
                "careerGoal": "Software Developer (Java / Cloud)",
                "skills": "Java, SQL, Git & GitHub"
            }
        """;

        mockMvc.perform(post("/api/students")
                .header("Authorization", "Bearer " + jwtToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(studentJson))
                .andExpect(status().isCreated());

        var history = assessmentRecordRepository.findByUserIdOrderByCreatedAtDesc(testStudent.getId());
        Long recordId = history.get(0).getId();

        // Update milestone checklist
        String updateJson = String.format("""
            {
                "recordId": %d,
                "milestoneIndex": 0,
                "completed": true
            }
        """, recordId);

        mockMvc.perform(post("/api/students/update-progress")
                .header("Authorization", "Bearer " + jwtToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(updateJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void testMalformedOrExpiredTokenRejected() throws Exception {
        mockMvc.perform(get("/api/students/my-history")
                .header("Authorization", "Bearer invalid.jwt.token.here"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void testCrossUserMilestoneUpdateForbidden() throws Exception {
        // Create assessment for Student A
        String studentJsonA = """
            {
                "name": "Syed Sohail",
                "branch": "Computer Science & Engineering",
                "year": "3rd Year",
                "cgpa": 8.85,
                "careerGoal": "Software Developer (Java / Cloud)",
                "skills": "Java, SQL, Git & GitHub"
            }
        """;

        mockMvc.perform(post("/api/students")
                .header("Authorization", "Bearer " + jwtToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(studentJsonA))
                .andExpect(status().isCreated());

        var historyA = assessmentRecordRepository.findByUserIdOrderByCreatedAtDesc(testStudent.getId());
        Long recordIdA = historyA.get(0).getId();

        // Create Student B
        User studentB = new User();
        studentB.setName("Rahul Kumar");
        studentB.setEmail("rahul.b@skillpath.ai");
        studentB.setPassword(passwordEncoder.encode("secretPass456"));
        studentB.setBranch("Information Technology");
        studentB.setYear("2nd Year");
        studentB.setRole("STUDENT");
        studentB = userRepository.save(studentB);

        String jwtTokenB = jwtTokenProvider.generateToken(studentB);

        // Student B attempts to modify Student A's recordId -> MUST return 403 FORBIDDEN
        String maliciousUpdate = String.format("""
            {
                "recordId": %d,
                "completedTopics": "Malicious topic"
            }
        """, recordIdA);

        mockMvc.perform(post("/api/students/update-progress")
                .header("Authorization", "Bearer " + jwtTokenB)
                .contentType(MediaType.APPLICATION_JSON)
                .content(maliciousUpdate))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.error").exists());
    }

    @Test
    void testCrossUserGetAssessmentByIdForbidden() throws Exception {
        // Create assessment for Student A
        String studentJsonA = """
            {
                "name": "Syed Sohail",
                "branch": "Computer Science & Engineering",
                "year": "3rd Year",
                "cgpa": 8.85,
                "careerGoal": "Software Developer (Java / Cloud)",
                "skills": "Java, SQL"
            }
        """;

        mockMvc.perform(post("/api/students")
                .header("Authorization", "Bearer " + jwtToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(studentJsonA))
                .andExpect(status().isCreated());

        var historyA = assessmentRecordRepository.findByUserIdOrderByCreatedAtDesc(testStudent.getId());
        Long recordIdA = historyA.get(0).getId();

        // Create Student B
        User studentB = new User();
        studentB.setName("Bob Smith");
        studentB.setEmail("bob@skillpath.ai");
        studentB.setPassword(passwordEncoder.encode("bobPassword123"));
        studentB.setRole("STUDENT");
        studentB = userRepository.save(studentB);
        String jwtTokenB = jwtTokenProvider.generateToken(studentB);

        // Student B attempts to GET Student A's assessment record -> MUST return 403 Forbidden
        mockMvc.perform(get("/api/students/assessment/" + recordIdA)
                .header("Authorization", "Bearer " + jwtTokenB))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.error").value("Access denied: You do not own this assessment record"));
    }

    @Test
    void testCrossUserDeleteAssessmentByIdForbidden() throws Exception {
        // Create assessment for Student A
        String studentJsonA = """
            {
                "name": "Syed Sohail",
                "branch": "Computer Science & Engineering",
                "year": "3rd Year",
                "cgpa": 8.85,
                "careerGoal": "Software Developer (Java / Cloud)",
                "skills": "Java, SQL"
            }
        """;

        mockMvc.perform(post("/api/students")
                .header("Authorization", "Bearer " + jwtToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(studentJsonA))
                .andExpect(status().isCreated());

        var historyA = assessmentRecordRepository.findByUserIdOrderByCreatedAtDesc(testStudent.getId());
        Long recordIdA = historyA.get(0).getId();

        // Create Student B
        User studentB = new User();
        studentB.setName("Bob Smith");
        studentB.setEmail("bob2@skillpath.ai");
        studentB.setPassword(passwordEncoder.encode("bobPassword123"));
        studentB.setRole("STUDENT");
        studentB = userRepository.save(studentB);
        String jwtTokenB = jwtTokenProvider.generateToken(studentB);

        // Student B attempts to DELETE Student A's record -> MUST return 403 Forbidden
        mockMvc.perform(delete("/api/students/assessment/" + recordIdA)
                .header("Authorization", "Bearer " + jwtTokenB))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.error").value("Access denied: You do not own this assessment record"));

        // Verify Student A's record was NOT deleted
        assertTrue(assessmentRecordRepository.findById(recordIdA).isPresent());
    }

    @Test
    void testOwnerCanGetAndDeleteOwnAssessment() throws Exception {
        String studentJson = """
            {
                "name": "Syed Sohail",
                "branch": "Computer Science & Engineering",
                "year": "3rd Year",
                "cgpa": 8.85,
                "careerGoal": "Software Developer (Java / Cloud)",
                "skills": "Java, SQL"
            }
        """;

        mockMvc.perform(post("/api/students")
                .header("Authorization", "Bearer " + jwtToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(studentJson))
                .andExpect(status().isCreated());

        var history = assessmentRecordRepository.findByUserIdOrderByCreatedAtDesc(testStudent.getId());
        Long recordId = history.get(0).getId();

        // Owner gets their assessment record
        mockMvc.perform(get("/api/students/assessment/" + recordId)
                .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(recordId))
                .andExpect(jsonPath("$.careerGoal").value("Software Developer (Java / Cloud)"));

        // Owner deletes their assessment record
        mockMvc.perform(delete("/api/students/assessment/" + recordId)
                .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        assertFalse(assessmentRecordRepository.findById(recordId).isPresent());
    }

    @Test
    void testUpdateProgressMissingRecordIdReturnsBadRequest() throws Exception {
        String payload = """
            {
                "completedTopics": "Topic 1"
            }
        """;

        mockMvc.perform(post("/api/students/update-progress")
                .header("Authorization", "Bearer " + jwtToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(payload))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("recordId is required"));
    }

    @Test
    void testAssessmentValidationMissingCareerGoal() throws Exception {
        String invalidJson = """
            {
                "name": "Syed Sohail",
                "branch": "Computer Science & Engineering",
                "year": "3rd Year",
                "cgpa": 8.85,
                "careerGoal": ""
            }
        """;

        mockMvc.perform(post("/api/students")
                .header("Authorization", "Bearer " + jwtToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(invalidJson))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Target career goal is required"));
    }

    @Test
    void testAssessmentValidationInvalidCgpa() throws Exception {
        String invalidJson = """
            {
                "name": "Syed Sohail",
                "branch": "Computer Science & Engineering",
                "year": "3rd Year",
                "cgpa": 12.5,
                "careerGoal": "Software Developer (Java / Cloud)"
            }
        """;

        mockMvc.perform(post("/api/students")
                .header("Authorization", "Bearer " + jwtToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(invalidJson))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("CGPA must be between 0.0 and 10.0"));
    }
}
