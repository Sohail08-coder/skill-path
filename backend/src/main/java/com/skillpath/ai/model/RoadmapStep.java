package com.skillpath.ai.model;

import java.util.List;

public class RoadmapStep {
    private int stepNumber;
    private String title;
    private String duration;
    private String description;
    private List<String> topics;
    private String status;

    public RoadmapStep() {
    }

    public RoadmapStep(int stepNumber, String title, String duration, String description, List<String> topics, String status) {
        this.stepNumber = stepNumber;
        this.title = title;
        this.duration = duration;
        this.description = description;
        this.topics = topics;
        this.status = status;
    }

    public int getStepNumber() {
        return stepNumber;
    }

    public void setStepNumber(int stepNumber) {
        this.stepNumber = stepNumber;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<String> getTopics() {
        return topics;
    }

    public void setTopics(List<String> topics) {
        this.topics = topics;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
