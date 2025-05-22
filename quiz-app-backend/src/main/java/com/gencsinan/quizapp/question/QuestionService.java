package com.gencsinan.quizapp.question;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class QuestionService {
    private final QuestionRepository questionRepository;

    @Autowired
    public QuestionService(QuestionRepository questionRepository) {
        this.questionRepository = questionRepository;
    }

    public Page<Question> getAllQuestions(Pageable pageable) {
        Page<Question> questions = questionRepository.findAll(
                PageRequest.of(
                        pageable.getPageNumber(),
                        pageable.getPageSize(),
                        pageable.getSortOr(Sort.by(Sort.Direction.ASC, "id"))
                )
        );

        return questions;
    }

    public Optional<Question> getQuestionById(Long questionId) {
        return questionRepository.findById(questionId);
    }

    public Question saveQuestion(Question question) {
        return questionRepository.save(question);
    }

    public boolean updateQuestion(Long questionId, Question updatedQuestion) {
        if (questionRepository.existsById(questionId)) {
            updatedQuestion.setId(questionId);
            questionRepository.save(updatedQuestion);
            return true;
        }
        return false;
    }

    public boolean deleteQuestionById(Long questionId) {
        if (questionRepository.existsById(questionId)) {
            questionRepository.deleteById(questionId);
            return true;
        }
        return false;
    }
}
