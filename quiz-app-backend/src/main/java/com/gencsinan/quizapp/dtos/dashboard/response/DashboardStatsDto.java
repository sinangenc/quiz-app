package com.gencsinan.quizapp.dtos.dashboard.response;

public class DashboardStatsDto {
    private long totalUsers;
    private long totalQuestions;
    private long totalResults;

    public DashboardStatsDto(long totalUsers, long totalQuestions, long totalResults) {
        this.totalUsers = totalUsers;
        this.totalQuestions = totalQuestions;
        this.totalResults = totalResults;
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getTotalQuestions() {
        return totalQuestions;
    }

    public void setTotalQuestions(long totalQuestions) {
        this.totalQuestions = totalQuestions;
    }

    public long getTotalResults() {
        return totalResults;
    }

    public void setTotalResults(long totalResults) {
        this.totalResults = totalResults;
    }
}
