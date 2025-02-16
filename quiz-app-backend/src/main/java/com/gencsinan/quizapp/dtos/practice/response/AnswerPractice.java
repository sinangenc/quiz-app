package com.gencsinan.quizapp.dtos.practice.response;

import jakarta.persistence.Column;

public class AnswerPractice {
    private Long id;
    private String answerText;

    public AnswerPractice(Long id, String answerText) {
        this.id = id;
        this.answerText = answerText;
    }

    public Long getId() {
        return id;
    }

    public String getAnswerText() {
        return answerText;
    }
}
