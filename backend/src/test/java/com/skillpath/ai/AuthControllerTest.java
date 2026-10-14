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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import com.skillpath.ai.model.User;
import com.skillpath.ai.repository.UserRepository;
import com.skillpath.ai.security.JwtTokenProvider;

@SpringBootTest
public class AuthControllerTest {

    @Autowired
    private WebApplicationContext context;

    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(context)
                .apply(springSecurity())
                .build();
        userRepository.deleteAll();
    }

    @Test
    void testRegisterSuccessWithBcrypt() throws Exception {
        String registrationJson = """
            {
                "name": "Syed Sohail",
                "email": "sohail.test@skillpath.ai",
                "password": "securePassword123",
                "university": "Hyderabad Institute of Tech",
                "branch": "Computer Science & Engineering",
                "year": "3rd Year",
                "role": "STUDENT"
            }
        """;

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(registrationJson))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.user.email").value("sohail.test@skillpath.ai"))
                .andExpect(jsonPath("$.user.name").value("Syed Sohail"))
                .andExpect(jsonPath("$.user.password").doesNotExist()); // Ensure password hash is NEVER leaked

        User saved = userRepository.findByEmail("sohail.test@skillpath.ai").orElse(null);
        assertNotNull(saved);
        assertFalse(saved.getPassword().equals("securePassword123"), "Password must NOT be stored in plaintext");
        assertTrue(passwordEncoder.matches("securePassword123", saved.getPassword()), "BCrypt must match raw password");
    }

    @Test
    void testRegisterDuplicateEmailRejection() throws Exception {
        User existing = new User();
        existing.setName("Existing Student");
        existing.setEmail("existing@skillpath.ai");
        existing.setPassword(passwordEncoder.encode("existingPass123"));
        userRepository.save(existing);

        String duplicateJson = """
            {
                "name": "Duplicate Student",
                "email": "existing@skillpath.ai",
                "password": "newPassword123"
            }
        """;

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(duplicateJson))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.error").value("An account with this email address already exists"));
    }

    @Test
    void testLoginSuccessAndJwtVerification() throws Exception {
        User user = new User();
        user.setName("John Doe");
        user.setEmail("john@skillpath.ai");
        user.setPassword(passwordEncoder.encode("johnSecretPass"));
        user.setRole("STUDENT");
        userRepository.save(user);

        String loginJson = """
            {
                "email": "john@skillpath.ai",
                "password": "johnSecretPass"
            }
        """;

        String response = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.user.name").value("John Doe"))
                .andReturn().getResponse().getContentAsString();

        assertTrue(response.contains("token"));
    }

    @Test
    void testLoginInvalidCredentials() throws Exception {
        String invalidLogin = """
            {
                "email": "nonexistent@skillpath.ai",
                "password": "wrongPassword"
            }
        """;

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(invalidLogin))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("Invalid email or password"));
    }

    @Test
    void testGetProfileUnauthenticated() throws Exception {
        mockMvc.perform(get("/api/auth/me"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void testGetProfileAuthenticatedWithValidJwt() throws Exception {
        User user = new User();
        user.setName("Alice Walker");
        user.setEmail("alice@skillpath.ai");
        user.setPassword(passwordEncoder.encode("alicePassword"));
        user.setRole("STUDENT");
        user = userRepository.save(user);

        String token = jwtTokenProvider.generateToken(user);

        mockMvc.perform(get("/api/auth/me")
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.user.email").value("alice@skillpath.ai"))
                .andExpect(jsonPath("$.user.name").value("Alice Walker"));
    }
}
