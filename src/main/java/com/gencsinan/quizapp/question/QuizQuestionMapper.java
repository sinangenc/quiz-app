package com.gencsinan.quizapp.question;

import com.gencsinan.quizapp.answer.Answer;
import com.gencsinan.quizapp.answer.AnswerWithoutCorrectDTO;

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
