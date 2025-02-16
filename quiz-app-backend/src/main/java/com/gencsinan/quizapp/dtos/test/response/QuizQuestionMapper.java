package com.gencsinan.quizapp.dtos.test.response;

import com.gencsinan.quizapp.answer.Answer;
import com.gencsinan.quizapp.question.Question;
import com.gencsinan.quizapp.question.QuestionWithImage;

import java.util.stream.Collectors;

public class QuizQuestionMapper {
    public static QuestionWithoutCorrectAnswerDTO questionMapper(Question question){
        String imagePath = null;
        if(question instanceof QuestionWithImage qi){
            imagePath = qi.getImagePath();
        }

        return new QuestionWithoutCorrectAnswerDTO(
                question.getId(),
                question.getQuestionText(),
                question.getAnswers().stream()
                        .map(QuizQuestionMapper::answerMapper)
                        .collect(Collectors.toList()),
                imagePath
                );
    }
    private static AnswerWithoutCorrectDTO answerMapper(Answer answer){
        return new AnswerWithoutCorrectDTO(answer.getId(), answer.getAnswerText());
    }
}
