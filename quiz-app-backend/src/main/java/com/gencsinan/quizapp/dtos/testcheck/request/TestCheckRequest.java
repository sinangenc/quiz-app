package com.gencsinan.quizapp.dtos.testcheck.request;

import java.util.List;

public class TestCheckRequest {
    private List<QuestionAnswer> answers;

    public List<QuestionAnswer> getAnswers() {
        return answers;
    }

    public void setAnswers(List<QuestionAnswer> answers) {
        this.answers = answers;
    }
}
