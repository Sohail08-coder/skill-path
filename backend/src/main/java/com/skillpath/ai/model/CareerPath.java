package com.skillpath.ai.model;

import java.util.List;

public class CareerPath {
    private String id;
    private String title;
    private String category;
    private String shortDescription;
    private String demandLevel;
    private String averageSalary;
    private String recommendedDuration;
    private List<String> coreSkills;
    private List<String> topTools;
    private String icon;
    private String accentColor;

    public CareerPath() {
    }

    public CareerPath(String id, String title, String category, String shortDescription,
                      String demandLevel, String averageSalary, String recommendedDuration,
                      List<String> coreSkills, List<String> topTools, String icon, String accentColor) {
        this.id = id;
        this.title = title;
        this.category = category;
        this.shortDescription = shortDescription;
        this.demandLevel = demandLevel;
        this.averageSalary = averageSalary;
        this.recommendedDuration = recommendedDuration;
        this.coreSkills = coreSkills;
        this.topTools = topTools;
        this.icon = icon;
        this.accentColor = accentColor;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getShortDescription() {
        return shortDescription;
    }

    public void setShortDescription(String shortDescription) {
        this.shortDescription = shortDescription;
    }

    public String getDemandLevel() {
        return demandLevel;
    }

    public void setDemandLevel(String demandLevel) {
        this.demandLevel = demandLevel;
    }

    public String getAverageSalary() {
        return averageSalary;
    }

    public void setAverageSalary(String averageSalary) {
        this.averageSalary = averageSalary;
    }

    public String getRecommendedDuration() {
        return recommendedDuration;
    }

    public void setRecommendedDuration(String recommendedDuration) {
        this.recommendedDuration = recommendedDuration;
    }

    public List<String> getCoreSkills() {
        return coreSkills;
    }

    public void setCoreSkills(List<String> coreSkills) {
        this.coreSkills = coreSkills;
    }

    public List<String> getTopTools() {
        return topTools;
    }

    public void setTopTools(List<String> topTools) {
        this.topTools = topTools;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public String getAccentColor() {
        return accentColor;
    }

    public void setAccentColor(String accentColor) {
        this.accentColor = accentColor;
    }
}
