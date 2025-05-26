package com.gencsinan.quizapp.quizresult;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.gencsinan.quizapp.user.User;
import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@EntityListeners(AuditingEntityListener.class)
public class QuizResult {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private QuizType quizType;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @CreatedDate
    @Column(nullable = false)
    private LocalDateTime completedAt;

    @Column(nullable = false)
    private long correctAnswersCount;

    @Column(nullable = false)
    private long wrongAnswersCount;

    public QuizResult() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public QuizType getQuizType() {
        return quizType;
    }

    public void setQuizType(QuizType quizType) {
        this.quizType = quizType;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }

    public long getCorrectAnswersCount() {
        return correctAnswersCount;
    }

    public void setCorrectAnswersCount(long correctAnswersCount) {
        this.correctAnswersCount = correctAnswersCount;
    }

    public long getWrongAnswersCount() {
        return wrongAnswersCount;
    }

    public void setWrongAnswersCount(long wrongAnswersCount) {
        this.wrongAnswersCount = wrongAnswersCount;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
