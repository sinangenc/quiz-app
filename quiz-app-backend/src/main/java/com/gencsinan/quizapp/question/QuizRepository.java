package com.gencsinan.quizapp.question;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface QuizRepository extends JpaRepository<Question, Long> {
    @Query(value = "SELECT * FROM question q LEFT JOIN question_with_image i ON q.id = i.id WHERE q.state IS NULL ORDER BY RANDOM() LIMIT :numberOfQuestions", nativeQuery = true)
    List<Question> findRandomGeneralQuestions(@Param("numberOfQuestions") int numberOfQuestions);

    @Query(value = "SELECT * FROM question q LEFT JOIN question_with_image qi ON q.id = qi.id WHERE q.state= :state ORDER BY RANDOM() LIMIT :numberOfQuestions", nativeQuery = true)
    List<Question> findRandomQuestionsByState(@Param("numberOfQuestions") int numberOfQuestions, @Param("state") String state);
}