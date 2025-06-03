package com.gencsinan.quizapp.dtos.users.response;

import com.gencsinan.quizapp.user.UserRole;

public class UserInfoResponse {
    private final Long id;
    private final String name;
    private final String email;
    private final UserRole role;

    public UserInfoResponse(Long id, String name, String email, UserRole role) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public UserRole getRole() {
        return role;
    }
}
