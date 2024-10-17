package com.gencsinan.quizapp.dtos.test.response;

import java.util.List;

public class QuestionWithoutCorrectAnswerDTO{
    private Long id;
    private String questionText;
    private List<AnswerWithoutCorrectDTO> answers;
    private String imagePath;

    public QuestionWithoutCorrectAnswerDTO(Long id, String questionText, List<AnswerWithoutCorrectDTO> answers, String imagePath) {
        this.id = id;
        this.questionText = questionText;
        this.answers = answers;
        this.imagePath = imagePath;
    }

    public Long getId() {
        return id;
    }

    public String getQuestionText() {
        return questionText;
    }

    public List<AnswerWithoutCorrectDTO> getAnswers() {
        return answers;
    }

    public String getImagePath() {
        return imagePath;
    }
}
