package com.gencsinan.quizapp.dtos.practice.response;

import com.gencsinan.quizapp.answer.Answer;

import java.util.List;

public class QuestionPractice {
    private Long questionId;
    private String questionText;
    private String imagePath;
    private List<AnswerPractice> answers;
    private Long correctAnswerId;

    public Long getQuestionId() {
        return questionId;
    }

    public void setQuestionId(Long questionId) {
        this.questionId = questionId;
    }

    public String getQuestionText() {
        return questionText;
    }

    public void setQuestionText(String questionText) {
        this.questionText = questionText;
    }

    public List<AnswerPractice> getAnswers() {
        return answers;
    }

    public void setAnswers(List<AnswerPractice> answers) {
        this.answers = answers;
    }

    public Long getCorrectAnswerId() {
        return correctAnswerId;
    }

    public void setCorrectAnswerId(Long correctAnswerId) {
        this.correctAnswerId = correctAnswerId;
    }

    public String getImagePath() {
        return imagePath;
    }

    public void setImagePath(String imagePath) {
        this.imagePath = imagePath;
    }
}
