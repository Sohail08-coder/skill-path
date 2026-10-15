package com.skillpath.ai.controller;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping({"/", "/api"})
    public ResponseEntity<Map<String, Object>> getApiRoot() {
        Map<String, Object> info = new LinkedHashMap<>();
        info.put("service", "SkillPath-AI REST API");
        info.put("status", "UP");
        info.put("version", "2.1.0");
        info.put("description", "AI-Powered Student Career Intelligence & Skill Benchmarking REST API");
        info.put("frontend", "https://skill-path-frontend-xi.vercel.app");
        info.put("timestamp", System.currentTimeMillis());

        Map<String, String> endpoints = new LinkedHashMap<>();
        endpoints.put("health", "/api/health");
        endpoints.put("auth_login", "/api/auth/login");
        endpoints.put("auth_register", "/api/auth/register");
        endpoints.put("auth_me", "/api/auth/me");
        endpoints.put("careers", "/api/careers");
        endpoints.put("students_assess", "/api/students");
        endpoints.put("students_history", "/api/students/my-history");
        endpoints.put("students_progress", "/api/students/update-progress");
        info.put("endpoints", endpoints);

        return ResponseEntity.ok(info);
    }
}