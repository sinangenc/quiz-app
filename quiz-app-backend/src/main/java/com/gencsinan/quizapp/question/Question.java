package com.gencsinan.quizapp.question;

import com.gencsinan.quizapp.answer.Answer;
import com.gencsinan.quizapp.state.State;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name = "question_type", discriminatorType = DiscriminatorType.STRING)
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String questionText;

    @Enumerated(EnumType.STRING)
    private State state;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true) // mappedBy = "question",
    @JoinColumn(name = "question_id", nullable = false)
    @Column(nullable = false)
    private List<Answer> answers;


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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
        return List.copyOf(this.answers);
    }

    public void setAnswers(List<Answer> answers) {
        this.answers = (answers == null) ? new ArrayList<>() : List.copyOf(answers);
    }

    @Override
    public String toString() {
        return "Question{" +
                "id=" + id +
                ", questionText='" + questionText + '\'' +
                ", state=" + state +
                ", answers=" + answers +
                '}';
    }
}