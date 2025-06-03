package com.gencsinan.quizapp.question;

import com.gencsinan.quizapp.answer.Answer;
import com.gencsinan.quizapp.dtos.question.request.QuestionCreateUpdateDTO;
import com.gencsinan.quizapp.file_storage.FileStorageService;
import com.gencsinan.quizapp.file_storage.LocalFileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

@Service
public class QuestionService {
    private final QuestionRepository questionRepository;
    private final FileStorageService fileStorageService;

    @Autowired
    public QuestionService(QuestionRepository questionRepository, FileStorageService fileStorageService) {
        this.questionRepository = questionRepository;
        this.fileStorageService = fileStorageService;
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

    public Question createNewQuestion(QuestionCreateUpdateDTO questionDTO, MultipartFile image) {
        // 1. Önce imagePath yokmuş gibi kaydet
        Question newQuestion = new Question();
        newQuestion.setQuestionText(questionDTO.getQuestionText());
        newQuestion.setState(questionDTO.getState());
        newQuestion.setAnswers(questionDTO.getAnswers());

        Question savedQuestion = questionRepository.save(newQuestion);

        // 2. Eğer image varsa kaydet
        if (image != null && !image.isEmpty()) {
            String extension = LocalFileStorageService.getExtension(image.getOriginalFilename());
            String fileName = savedQuestion.getId() + extension;

            String imagePath = fileStorageService.saveFile(image, fileName);
            savedQuestion.setImagePath(imagePath);
            questionRepository.save(savedQuestion);
        }

        return savedQuestion;
    }

    public boolean updateQuestion(Long questionId, QuestionCreateUpdateDTO dto, MultipartFile image, boolean removeImage) {
        Optional<Question> optionalQuestion = questionRepository.findById(questionId);
        if (optionalQuestion.isEmpty()) {
            return false;
        }

        Question question = optionalQuestion.get();

        // 1. Update textual parts of Question
        question.setQuestionText(dto.getQuestionText());
        question.setState(dto.getState());

        // question.setAnswers(dto.getAnswers());
        question.getAnswers().clear();
        for (Answer answer : dto.getAnswers()) {
            question.getAnswers().add(answer);
        }

        // 2. Delete image, if neccessary
        if (removeImage && question.getImagePath() != null) {
            String imagePath = question.getImagePath();
            String fileName = LocalFileStorageService.extractFileNameFromPath(imagePath);
            fileStorageService.deleteFile(fileName);

            question.setImagePath(null);
        }

        // 3. Upload new image and update imagePath
        if (image != null && !image.isEmpty()) {
            // First, delete old image
            if (question.getImagePath() != null) {
                String imagePath = question.getImagePath();
                String fileName = LocalFileStorageService.extractFileNameFromPath(imagePath);
                fileStorageService.deleteFile(fileName);
            }

            String extension = LocalFileStorageService.getExtension(image.getOriginalFilename());
            String fileName = question.getId() + extension;
            String imagePath = fileStorageService.saveFile(image, fileName);

            question.setImagePath(imagePath);
        }

        questionRepository.save(question);

        return true;
    }

    public boolean deleteQuestionById(Long questionId) {
        Optional<Question> optionalQuestion = questionRepository.findById(questionId);
        if (optionalQuestion.isPresent()) {
            Question question = optionalQuestion.get();

            // Eğer imagePath varsa resmi sil
            if (question.getImagePath() != null && !question.getImagePath().isEmpty()) {
                // http://localhost:8080/files/questions/472.png -> 472.png
                String imagePath = question.getImagePath();
                String fileName = LocalFileStorageService.extractFileNameFromPath(imagePath);

                fileStorageService.deleteFile(fileName);
            }

            questionRepository.deleteById(questionId);
            return true;
        }
        return false;
    }
}
