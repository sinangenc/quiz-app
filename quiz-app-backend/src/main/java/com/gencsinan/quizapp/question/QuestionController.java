package com.gencsinan.quizapp.question;

import com.gencsinan.quizapp.dtos.question.request.QuestionCreateUpdateDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
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
    public ResponseEntity<Page<Question>> getAllQuestions(Pageable pageable) {
        Page<Question> questions = questionService.getAllQuestions(pageable);
        //return ResponseEntity.ok(questions.getContent());
        return ResponseEntity.ok(questions);
    }

    @GetMapping("/{questionId}")
    public ResponseEntity<Question> getQuestionById(@PathVariable Long questionId) {
        Optional<Question> question = questionService.getQuestionById(questionId);
        return question
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Void> createNewQuestion(
            @RequestPart("question") QuestionCreateUpdateDTO questionDTO,
            @RequestPart(value = "image", required = false) MultipartFile image,
            UriComponentsBuilder ucb) {
        Question savedQuestion = questionService.createNewQuestion(questionDTO, image);
        URI locationOfNewQuestion = ucb
                .path("/admin/questions/{id}")
                .buildAndExpand(savedQuestion.getId())
                .toUri();

        return ResponseEntity.created(locationOfNewQuestion).build();
    }

    @PutMapping(value = "/{questionId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Void> updateQuestion(
            @PathVariable Long questionId,
            @RequestPart("question") QuestionCreateUpdateDTO updatedQuestionDTO,
            @RequestPart(value = "image", required = false) MultipartFile image,
            @RequestParam(value = "removeImage", required = false, defaultValue = "false") boolean removeImage
    ) {
        boolean updated = questionService.updateQuestion(questionId, updatedQuestionDTO, image, removeImage);

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