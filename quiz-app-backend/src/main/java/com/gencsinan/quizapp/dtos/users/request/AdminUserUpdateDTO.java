package com.gencsinan.quizapp.dtos.users.request;

import com.gencsinan.quizapp.user.UserRole;

public class AdminUserUpdateDTO {
    private String name;
    private String email;
    private UserRole role;
    private boolean active;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public UserRole getRole() {
        return role;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}
