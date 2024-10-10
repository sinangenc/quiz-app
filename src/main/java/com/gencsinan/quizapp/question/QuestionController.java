package com.gencsinan.quizapp.question;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/admin/questions")
public class QuestionController {

    private final QuestionRepository questionRepository;

    @Autowired
    public QuestionController(QuestionRepository questionRepository) {
        this.questionRepository = questionRepository;
    }

    @GetMapping
    public ResponseEntity<List<Question>> getAllQuestions(Pageable pageable) {
        Page<Question> questions = questionRepository.findAll(
                PageRequest.of(
                        pageable.getPageNumber(),
                        pageable.getPageSize(),
                        pageable.getSortOr(Sort.by(Sort.Direction.ASC, "id"))
                )
        );

        return ResponseEntity.ok(questions.getContent());
    }

    @GetMapping("/{questionId}")
    public ResponseEntity<Question> getQuestionById(@PathVariable Long questionId) {
        Optional<Question> question = questionRepository.findById(questionId);

        if (question.isPresent()) {
            return ResponseEntity.ok(question.get());
        }

        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<Void> createNewQuestion(@RequestBody Question question, UriComponentsBuilder ucb) {
        Question savedQuestion = questionRepository.save(question);
        URI locationOfNewQuestion = ucb
                .path("/admin/questions/{id}")
                .buildAndExpand(savedQuestion.getId())
                .toUri();

        return ResponseEntity.created(locationOfNewQuestion).build();
    }

    @PutMapping("/{questionId}")
    public ResponseEntity<Void> updateQuestion(@PathVariable Long questionId, @RequestBody Question updatedQuestion) {
        Optional<Question> question = questionRepository.findById(questionId);

        System.out.println(questionId + " " + updatedQuestion);

        if (question.isPresent()) {
            System.out.println("PRESENT");
            updatedQuestion.setId(questionId);
            questionRepository.save(updatedQuestion);
            return ResponseEntity.noContent().build();
        }


        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{questionId}")
    public ResponseEntity<Void> deleteQuestionById(@PathVariable Long questionId) {
        if(questionRepository.existsById(questionId)){
            questionRepository.deleteById(questionId);
            return ResponseEntity.noContent().build();
        }
        else{
            return ResponseEntity.notFound().build();
        }
    }
}