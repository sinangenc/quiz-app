package com.gencsinan.quizapp.quizresult;

import com.gencsinan.quizapp.question.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/quiz-results")
public class QuizResultController {
    private final QuizResultService quizResultService;

    @Autowired
    public QuizResultController(QuizResultService quizResultService) {
        this.quizResultService = quizResultService;
    }

    @GetMapping
    public ResponseEntity<List<QuizResult>> getQuizResults(Principal principal, Pageable pageable) {
        String email = principal.getName();
        Page<QuizResult> quizResults = quizResultService.getQuizResults(email, pageable);
        return ResponseEntity.ok(quizResults.getContent());
    }

    @PostMapping
    public ResponseEntity<Void> createQuizResult(@RequestBody QuizResult quizResult, Principal principal, UriComponentsBuilder ucb) {
        QuizResult savedQuizResult = quizResultService.saveQuizResult(quizResult, principal);
        URI locationOfNewQuizResult = ucb
                .path("/quiz-results/{id}")
                .buildAndExpand(savedQuizResult.getId())
                .toUri();

        return ResponseEntity.created(locationOfNewQuizResult).build();
    }
}
