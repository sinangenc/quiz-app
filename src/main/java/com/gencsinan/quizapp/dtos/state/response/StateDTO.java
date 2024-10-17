package com.gencsinan.quizapp.dtos.state.response;

public class StateDTO {
    private String code;
    private String name;

    public StateDTO(String code, String name) {
        this.code = code;
        this.name = name;
    }

    public String getCode() {
        return code;
    }

    public String getName() {
        return name;
    }
}
