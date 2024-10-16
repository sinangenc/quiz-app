package com.gencsinan.quizapp.question;

import com.gencsinan.quizapp.answer.Answer;
import com.gencsinan.quizapp.dtos.testcheck.request.QuestionAnswer;
import com.gencsinan.quizapp.dtos.testcheck.request.TestCheckRequest;
import com.gencsinan.quizapp.dtos.testcheck.response.QuestionResponse;
import com.gencsinan.quizapp.dtos.testcheck.response.TestCheckResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
public class QuizController {
    private QuizRepository quizRepository;

    @Autowired
    public QuizController(QuizRepository quizRepository) {
        this.quizRepository = quizRepository;
    }

    @GetMapping("/test/{state}")
    public ResponseEntity<List<QuestionWithoutCorrectAnswerDTO>> getARandomTest(@PathVariable String state) {
        // A test contains 33 questions
        // 30 general questions + 3 state-specific questions
        List<Question> questions = quizRepository.findRandomGeneralQuestions(30);
        List<Question> state_questions = quizRepository.findRandomQuestionsByState(3, state);
        questions.addAll(state_questions);

        // Remove correct answer and unnecessary fields using DTO
        List<QuestionWithoutCorrectAnswerDTO> questionWithoutCorrectAnswers = questions.stream()
                .map(QuizQuestionMapper::questionMapper)
                .toList();

        return ResponseEntity.ok(questionWithoutCorrectAnswers);
    }

    @PostMapping("/test/check")
    public ResponseEntity<TestCheckResponse> checkAnswers(@RequestBody TestCheckRequest request) {
        // Extract question ids from request
        List<Long> questionIds = request.getAnswers().stream().map(QuestionAnswer::getQuestionId).toList();

        // Query all questions
        List<Question> questions = quizRepository.findAllById(questionIds);

        // Prepare response objects for each question
        List<QuestionResponse> questionsForResponse = new ArrayList<>();
        for (Question question : questions) {
            Long correctAnswerId = question.getAnswers().stream()
                    .filter(Answer::isCorrect)
                    .map(Answer::getId)
                    .findFirst()
                    .orElse(null);

            Long selectedAnswerId = request.getAnswers().stream()
                    .filter(questionAnswer -> questionAnswer.getQuestionId().equals(question.getId()))
                    .map(QuestionAnswer::getAnswerId)
                    .findFirst()
                    .orElse(null);

            QuestionResponse questionResponse = new QuestionResponse();
            questionResponse.setQuestionId(question.getId());
            questionResponse.setCorrectAnswerId(correctAnswerId);
            questionResponse.setSelectedAnswerId(selectedAnswerId);
            questionResponse.setCorrect(correctAnswerId != null && correctAnswerId.equals(selectedAnswerId));

            questionsForResponse.add(questionResponse);
        }

        // Create response with statistics
        TestCheckResponse response = new TestCheckResponse();
        response.setQuestions(questionsForResponse);
        response.setNumberOfCorrectAnswers(questionsForResponse.stream()
                .filter(QuestionResponse::isCorrect)
                .count()
        );
        response.setNumberOfWrongAnswers(questionsForResponse.stream().
                filter(questionResponse -> !questionResponse.isCorrect())
                .count()
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/training")
    public ResponseEntity<Question> getRandomQuestion() {
        return ResponseEntity.notFound().build();
    }
}