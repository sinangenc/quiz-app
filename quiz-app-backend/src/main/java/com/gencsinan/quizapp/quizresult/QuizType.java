package com.gencsinan.quizapp.quizresult;

public enum QuizType {
    TEST("Test"),
    PRACTICE("Practice");

    private final String name;

    QuizType(String name){
        this.name = name;
    }

    public String getName() {
        return name;
    }
}
