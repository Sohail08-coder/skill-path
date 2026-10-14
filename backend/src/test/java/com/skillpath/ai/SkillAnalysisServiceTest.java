package com.skillpath.ai;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.skillpath.ai.model.AnalysisResult;
import com.skillpath.ai.model.Student;
import com.skillpath.ai.service.SkillAnalysisService;

@SpringBootTest
public class SkillAnalysisServiceTest {

    @Autowired
    private SkillAnalysisService skillAnalysisService;

    @Test
    void testSoftwareEngineeringTrackAnalysis() {
        Student student = new Student();
        student.setName("Syed Sohail");
        student.setBranch("Computer Science & Engineering");
        student.setYear("3rd Year");
        student.setCgpa(8.85);
        student.setCareerGoal("Software Developer (Java / Cloud)");
        student.setSkills("Java, SQL, Git & GitHub");

        AnalysisResult result = skillAnalysisService.generateComprehensiveAnalysis(student);

        assertNotNull(result);
        assertTrue(result.getReadinessScore() >= 40 && result.getReadinessScore() <= 100);
        assertTrue(result.getAcquiredSkills().contains("Java"));
        assertTrue(result.getAcquiredSkills().contains("SQL"));
        assertTrue(result.getMissingSkills().contains("Spring Boot") || result.getMissingSkills().contains("Docker"));
        assertFalse(result.getRoadmap().isEmpty());
        assertEquals(4, result.getRoadmap().size());
        assertFalse(result.getRecommendedProjects().isEmpty());
        assertFalse(result.getRecommendedCertifications().isEmpty());
    }

    @Test
    void testAiMlTrackAnalysis() {
        Student student = new Student();
        student.setName("Priya Sharma");
        student.setBranch("AI & Machine Learning");
        student.setCareerGoal("AI / Machine Learning Engineer");
        student.setSkills("Python, Pandas & Data Wrangling");

        AnalysisResult result = skillAnalysisService.generateComprehensiveAnalysis(student);

        assertNotNull(result);
        assertTrue(result.getAcquiredSkills().contains("Python"));
        assertTrue(result.getMissingSkills().contains("Deep Learning") || result.getMissingSkills().contains("MLOps"));
    }
}
