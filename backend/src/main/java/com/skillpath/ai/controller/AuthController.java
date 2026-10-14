package com.skillpath.ai.controller;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Pattern;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.skillpath.ai.model.User;
import com.skillpath.ai.repository.AssessmentRecordRepository;
import com.skillpath.ai.repository.StudentRepository;
import com.skillpath.ai.repository.UserRepository;
import com.skillpath.ai.security.JwtTokenProvider;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final AssessmentRecordRepository assessmentRecordRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthController(UserRepository userRepository,
                          StudentRepository studentRepository,
                          AssessmentRecordRepository assessmentRecordRepository,
                          PasswordEncoder passwordEncoder,
                          JwtTokenProvider jwtTokenProvider) {
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.assessmentRecordRepository = assessmentRecordRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;

        seedDefaultDemoUser();
    }

    private void seedDefaultDemoUser() {
        try {
            if (!userRepository.existsByEmail("student@skillpath.ai")) {
                User demoUser = new User();
                demoUser.setName("Syed Sohail");
                demoUser.setEmail("student@skillpath.ai");
                demoUser.setPassword(passwordEncoder.encode("password123"));
                demoUser.setUniversity("Tech University");
                demoUser.setBranch("Computer Science & Engineering");
                demoUser.setYear("3rd Year");
                demoUser.setRole("STUDENT");
                demoUser.setCreatedAt(LocalDateTime.now());
                userRepository.save(demoUser);
                logger.info("Verified demo student active: student@skillpath.ai");
            }
        } catch (Exception e) {
            logger.warn("Could not seed demo student account: {}", e.getMessage());
        }
    }

    @PostMapping("/seed-demo")
    @Transactional
    public ResponseEntity<Map<String, Object>> resetToSingleDemoUser() {
        seedDefaultDemoUser();
        Map<String, Object> response = new HashMap<>();
        response.put("message", "All data deleted. Exactly one verified demo user active.");
        response.put("demoEmail", "student@skillpath.ai");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    @Transactional
    public ResponseEntity<Map<String, Object>> register(@RequestBody User user) {
        Map<String, Object> response = new HashMap<>();

        if (user.getName() == null || user.getName().trim().isEmpty()) {
            response.put("error", "Full name is required");
            return ResponseEntity.badRequest().body(response);
        }

        if (user.getEmail() == null || !EMAIL_PATTERN.matcher(user.getEmail().trim()).matches()) {
            response.put("error", "A valid email address is required");
            return ResponseEntity.badRequest().body(response);
        }

        if (user.getPassword() == null || user.getPassword().length() < 6) {
            response.put("error", "Password must be at least 6 characters long");
            return ResponseEntity.badRequest().body(response);
        }

        String normalizedEmail = user.getEmail().trim().toLowerCase();

        if (userRepository.existsByEmail(normalizedEmail)) {
            response.put("error", "An account with this email address already exists");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        }

        // Hash password securely with BCrypt
        user.setEmail(normalizedEmail);
        user.setName(user.getName().trim());
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole(user.getRole() != null ? user.getRole().toUpperCase() : "STUDENT");
        user.setCreatedAt(LocalDateTime.now());

        User savedUser = userRepository.save(user);

        String token = jwtTokenProvider.generateToken(savedUser);

        Map<String, Object> userData = sanitizeUser(savedUser);

        response.put("message", "User registered successfully");
        response.put("token", token);
        response.put("user", userData);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    @Transactional(readOnly = true)
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> credentials) {
        Map<String, Object> response = new HashMap<>();
        String email = credentials.get("email");
        String password = credentials.get("password");

        if (email == null || password == null || email.trim().isEmpty() || password.isEmpty()) {
            response.put("error", "Email and password are required");
            return ResponseEntity.badRequest().body(response);
        }

        String normalizedEmail = email.trim().toLowerCase();

        User user = userRepository.findByEmail(normalizedEmail).orElse(null);

        if (user == null || !passwordEncoder.matches(password, user.getPassword())) {
            response.put("error", "Invalid email or password");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        String token = jwtTokenProvider.generateToken(user);
        Map<String, Object> userData = sanitizeUser(user);

        response.put("message", "Login successful");
        response.put("token", token);
        response.put("user", userData);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    @Transactional(readOnly = true)
    public ResponseEntity<Map<String, Object>> getCurrentUser() {
        Map<String, Object> response = new HashMap<>();
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            response.put("error", "Unauthorized access. Valid token required.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        String email = authentication.getName();
        User user = userRepository.findByEmail(email.toLowerCase()).orElse(null);

        if (user == null) {
            response.put("error", "User account not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        response.put("user", sanitizeUser(user));
        return ResponseEntity.ok(response);
    }

    private Map<String, Object> sanitizeUser(User user) {
        Map<String, Object> data = new HashMap<>();
        data.put("id", user.getId());
        data.put("name", user.getName());
        data.put("email", user.getEmail());
        data.put("university", user.getUniversity());
        data.put("branch", user.getBranch());
        data.put("year", user.getYear());
        data.put("role", user.getRole());
        data.put("createdAt", user.getCreatedAt());
        return data;
    }
}
