package com.gencsinan.quizapp.question;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/admin/questions")
public class QuestionController {

    private final QuestionService questionService;

    @Autowired
    public QuestionController(QuestionService questionService) {
        this.questionService = questionService;
    }

    @GetMapping
    public ResponseEntity<List<Question>> getAllQuestions(Pageable pageable) {
        Page<Question> questions = questionService.getAllQuestions(pageable);
        return ResponseEntity.ok(questions.getContent());
    }

    @GetMapping("/{questionId}")
    public ResponseEntity<Question> getQuestionById(@PathVariable Long questionId) {
        Optional<Question> question = questionService.getQuestionById(questionId);
        return question
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Void> createNewQuestion(@RequestBody Question question, UriComponentsBuilder ucb) {
        Question savedQuestion = questionService.saveQuestion(question);
        URI locationOfNewQuestion = ucb
                .path("/admin/questions/{id}")
                .buildAndExpand(savedQuestion.getId())
                .toUri();

        return ResponseEntity.created(locationOfNewQuestion).build();
    }

    @PutMapping("/{questionId}")
    public ResponseEntity<Void> updateQuestion(@PathVariable Long questionId, @RequestBody Question updatedQuestion) {
        boolean updated = questionService.updateQuestion(questionId, updatedQuestion);

        if (updated) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{questionId}")
    public ResponseEntity<Void> deleteQuestionById(@PathVariable Long questionId) {
        boolean deleted = questionService.deleteQuestionById(questionId);

        if (deleted) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.notFound().build();
    }
}