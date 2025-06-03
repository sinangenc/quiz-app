package com.gencsinan.quizapp.dtos.question.request;

import com.gencsinan.quizapp.answer.Answer;
import com.gencsinan.quizapp.state.State;
import java.util.List;

public class QuestionCreateUpdateDTO {
    private String questionText;

    private State state;

    private List<Answer> answers;

    public String getQuestionText() {
        return questionText;
    }

    public void setQuestionText(String questionText) {
        this.questionText = questionText;
    }

    public State getState() {
        return state;
    }

    public void setState(State state) {
        this.state = state;
    }

    public List<Answer> getAnswers() {
        return answers;
    }

    public void setAnswers(List<Answer> answers) {
        this.answers = answers;
    }
}
