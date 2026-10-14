package com.skillpath.ai.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.skillpath.ai.model.AssessmentRecord;

@Repository
public interface AssessmentRecordRepository extends JpaRepository<AssessmentRecord, Long> {
    List<AssessmentRecord> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<AssessmentRecord> findByUserEmailOrderByCreatedAtDesc(String userEmail);
}
