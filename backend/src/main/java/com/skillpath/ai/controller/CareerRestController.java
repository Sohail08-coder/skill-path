package com.skillpath.ai.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.skillpath.ai.model.CareerPath;
import com.skillpath.ai.service.CareerCatalogService;

@RestController
@RequestMapping("/api/careers")
@CrossOrigin(origins = "*")
public class CareerRestController {

    private final CareerCatalogService careerCatalogService;

    public CareerRestController(CareerCatalogService careerCatalogService) {
        this.careerCatalogService = careerCatalogService;
    }

    @GetMapping
    public ResponseEntity<List<CareerPath>> getAllCareers() {
        return ResponseEntity.ok(careerCatalogService.getAllCareers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CareerPath> getCareerById(@PathVariable String id) {
        return careerCatalogService.getCareerById(id)
            .map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
