package com.skillpath.ai.controller;

import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

import com.skillpath.ai.model.Student;
import com.skillpath.ai.repository.StudentRepository;
import com.skillpath.ai.service.SkillAnalysisService;

@Controller
public class StudentController {

    private final StudentRepository studentRepository;
    private final SkillAnalysisService skillAnalysisService;

    public StudentController(StudentRepository studentRepository,
                             SkillAnalysisService skillAnalysisService) {
        this.studentRepository = studentRepository;
        this.skillAnalysisService = skillAnalysisService;
    }

    @GetMapping("/profile")
    public String showProfile(Model model) {
        model.addAttribute("student", new Student());
        return "profile";
    }

    @PostMapping("/profile")
    public String saveStudent(Student student, Model model) {

        // Save student to MySQL
        Student savedStudent = studentRepository.save(student);

        // Print student data in CMD
        System.out.println();
        System.out.println("========================================");
        System.out.println("       NEW STUDENT REGISTERED");
        System.out.println("========================================");
        System.out.println("ID             : " + savedStudent.getId());
        System.out.println("Name           : " + savedStudent.getName());
        System.out.println("Email          : " + savedStudent.getEmail());
        System.out.println("Branch         : " + savedStudent.getBranch());
        System.out.println("Year           : " + savedStudent.getYear());
        System.out.println("CGPA           : " + savedStudent.getCgpa());
        System.out.println("Skills         : " + savedStudent.getSkills());
        System.out.println("Interests      : " + savedStudent.getInterests());
        System.out.println("Projects       : " + savedStudent.getProjects());
        System.out.println("Certifications : " + savedStudent.getCertifications());
        System.out.println("Career Goal    : " + savedStudent.getCareerGoal());
        System.out.println("========================================");
        System.out.println("       STUDENT SAVED SUCCESSFULLY");
        System.out.println("========================================");
        System.out.println();
        System.out.println(">>> SKILL ANALYSIS CODE REACHED <<<");

        List<String> missingSkills = skillAnalysisService.analyzeSkills(savedStudent);

        System.out.println();
        System.out.println("========================================");
        System.out.println("         SKILL GAP ANALYSIS");
        System.out.println("========================================");

        if (missingSkills.isEmpty()) {
            System.out.println("No major skill gaps found!");
        } else {
            System.out.println("Missing Skills:");
            for (String skill : missingSkills) {
                System.out.println("- " + skill);
            }
        }
        System.out.println("========================================");

        model.addAttribute("savedStudent", savedStudent);
        model.addAttribute("missingSkills", missingSkills);
        model.addAttribute("successMessage", "Profile saved successfully!");

        return "profile";
    }
}