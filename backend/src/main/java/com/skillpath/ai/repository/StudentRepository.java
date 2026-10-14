package com.skillpath.ai.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.skillpath.ai.model.Student;

public interface StudentRepository extends JpaRepository<Student, Long> {

}