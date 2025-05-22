package com.gencsinan.quizapp.question;

import com.gencsinan.quizapp.dtos.practice.response.QuestionPractice;
import com.gencsinan.quizapp.dtos.test.response.QuestionWithoutCorrectAnswerDTO;
import com.gencsinan.quizapp.dtos.testcheck.request.TestCheckRequest;
import com.gencsinan.quizapp.dtos.testcheck.response.TestCheckResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class QuizController {
    private final QuizService quizService;

    @Autowired
    public QuizController(QuizService quizService) {
        this.quizService = quizService;
    }

    @GetMapping("/test/{state}")
    public ResponseEntity<List<QuestionWithoutCorrectAnswerDTO>> getARandomTest(@PathVariable String state) {
        List<QuestionWithoutCorrectAnswerDTO> testQuestions = quizService.generateRandomTest(state);
        return ResponseEntity.ok(testQuestions);
    }

    @PostMapping("/test/check")
    public ResponseEntity<TestCheckResponse> checkAnswers(@RequestBody TestCheckRequest request) {
        TestCheckResponse response = quizService.checkAnswers(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/practice")
    public ResponseEntity<QuestionPractice> getRandomQuestion() {
        QuestionPractice practiceQuestion = quizService.getRandomPracticeQuestion();
        return ResponseEntity.ok(practiceQuestion);
    }
}