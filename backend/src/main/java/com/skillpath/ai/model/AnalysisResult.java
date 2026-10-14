package com.skillpath.ai.model;

import java.util.List;

public class AnalysisResult {
    private Student student;
    private String careerGoal;
    private int readinessScore;
    private List<String> missingSkills;
    private List<String> acquiredSkills;
    private List<RoadmapStep> roadmap;
    private List<String> recommendedProjects;
    private List<String> recommendedCertifications;
    private String summary;

    public AnalysisResult() {
    }

    public AnalysisResult(Student student, String careerGoal, int readinessScore,
                          List<String> missingSkills, List<String> acquiredSkills,
                          List<RoadmapStep> roadmap, List<String> recommendedProjects,
                          List<String> recommendedCertifications, String summary) {
        this.student = student;
        this.careerGoal = careerGoal;
        this.readinessScore = readinessScore;
        this.missingSkills = missingSkills;
        this.acquiredSkills = acquiredSkills;
        this.roadmap = roadmap;
        this.recommendedProjects = recommendedProjects;
        this.recommendedCertifications = recommendedCertifications;
        this.summary = summary;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public String getCareerGoal() {
        return careerGoal;
    }

    public void setCareerGoal(String careerGoal) {
        this.careerGoal = careerGoal;
    }

    public int getReadinessScore() {
        return readinessScore;
    }

    public void setReadinessScore(int readinessScore) {
        this.readinessScore = readinessScore;
    }

    public List<String> getMissingSkills() {
        return missingSkills;
    }

    public void setMissingSkills(List<String> missingSkills) {
        this.missingSkills = missingSkills;
    }

    public List<String> getAcquiredSkills() {
        return acquiredSkills;
    }

    public void setAcquiredSkills(List<String> acquiredSkills) {
        this.acquiredSkills = acquiredSkills;
    }

    public List<RoadmapStep> getRoadmap() {
        return roadmap;
    }

    public void setRoadmap(List<RoadmapStep> roadmap) {
        this.roadmap = roadmap;
    }

    public List<String> getRecommendedProjects() {
        return recommendedProjects;
    }

    public void setRecommendedProjects(List<String> recommendedProjects) {
        this.recommendedProjects = recommendedProjects;
    }

    public List<String> getRecommendedCertifications() {
        return recommendedCertifications;
    }

    public void setRecommendedCertifications(List<String> recommendedCertifications) {
        this.recommendedCertifications = recommendedCertifications;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }
}
