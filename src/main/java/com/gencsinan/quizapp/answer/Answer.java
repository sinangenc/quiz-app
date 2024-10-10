package com.gencsinan.quizapp.answer;

import com.gencsinan.quizapp.question.Question;
import jakarta.persistence.*;

@Entity
public class Answer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String answerText;

    @Column(nullable = false)
    private boolean correct;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAnswerText() {
        return answerText;
    }

    public void setAnswerText(String answerText) {
        this.answerText = answerText;
    }

    public boolean isCorrect() {
        return correct;
    }

    public void setCorrect(boolean correct) {
        this.correct = correct;
    }

    public Answer() {
    }

    public Answer(String answerText, boolean correct) {
        this.answerText = answerText;
        this.correct = correct;
    }
}
