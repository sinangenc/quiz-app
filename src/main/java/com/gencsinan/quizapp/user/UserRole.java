package com.gencsinan.quizapp.user;

public enum UserRole {
    ADMIN("Admin"),
    USER("Normal User");

    private final String description;

    UserRole(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
