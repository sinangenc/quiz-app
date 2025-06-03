package com.gencsinan.quizapp.question;

import com.gencsinan.quizapp.answer.Answer;
import com.gencsinan.quizapp.dtos.practice.response.AnswerPractice;
import com.gencsinan.quizapp.dtos.practice.response.QuestionPractice;
import com.gencsinan.quizapp.dtos.test.response.QuestionWithoutCorrectAnswerDTO;
import com.gencsinan.quizapp.dtos.test.response.QuizQuestionMapper;
import com.gencsinan.quizapp.dtos.testcheck.request.QuestionAnswer;
import com.gencsinan.quizapp.dtos.testcheck.request.TestCheckRequest;
import com.gencsinan.quizapp.dtos.testcheck.response.QuestionResponse;
import com.gencsinan.quizapp.dtos.testcheck.response.TestCheckResponse;
import com.gencsinan.quizapp.quizresult.QuizResult;
import com.gencsinan.quizapp.quizresult.QuizResultService;
import com.gencsinan.quizapp.quizresult.QuizType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class QuizService {
    private final QuizRepository quizRepository;
    private final QuizResultService quizResultService;

    @Autowired
    public QuizService(QuizRepository quizRepository, QuizResultService quizResultService){
        this.quizRepository = quizRepository;
        this.quizResultService = quizResultService;
    }

    public List<QuestionWithoutCorrectAnswerDTO> generateRandomTest(String state) {
        // A test contains 33 questions
        // 30 general questions + 3 state-specific questions
        List<Question> generalQuestions = quizRepository.findRandomGeneralQuestions(30);
        List<Question> stateQuestions = quizRepository.findRandomQuestionsByState(3, state);
        generalQuestions.addAll(stateQuestions);

        // Remove correct answer and unnecessary fields using DTO
        return generalQuestions.stream()
                .map(QuizQuestionMapper::questionMapper)
                .toList();
    }

    public TestCheckResponse checkAnswers(TestCheckRequest request, Principal principal) {
        // Extract question ids from request
        List<Long> questionIds = request.getAnswers().stream()
                .map(QuestionAnswer::getQuestionId)
                .toList();

        // Query all questions
        List<Question> questions = quizRepository.findAllById(questionIds);

        // Prepare response
        List<QuestionResponse> questionsForResponse = new ArrayList<>();

        for (Question question : questions) {
            Long correctAnswerId = question.getAnswers().stream()
                    .filter(Answer::isCorrect)
                    .map(Answer::getId)
                    .findFirst()
                    .orElse(null);

            Long selectedAnswerId = request.getAnswers().stream()
                    .filter(qa -> qa.getQuestionId() != null && qa.getQuestionId().equals(question.getId()))
                    .map(QuestionAnswer::getAnswerId)
                    .map(Optional::ofNullable)
                    .findFirst()
                    .flatMap(Function.identity())
                    .orElse(null);

            QuestionResponse questionResponse = new QuestionResponse();
            questionResponse.setQuestionId(question.getId());
            questionResponse.setCorrectAnswerId(correctAnswerId);
            questionResponse.setSelectedAnswerId(selectedAnswerId);
            questionResponse.setCorrect(correctAnswerId != null && correctAnswerId.equals(selectedAnswerId));

            questionsForResponse.add(questionResponse);
        }

        // Build summary
        long correctAnswersCount = questionsForResponse.stream().filter(QuestionResponse::isCorrect).count();
        long wrongAnswersCount = questionsForResponse.stream().filter(q -> !q.isCorrect()).count();

        TestCheckResponse response = new TestCheckResponse();
        response.setQuestions(questionsForResponse);
        response.setNumberOfCorrectAnswers(correctAnswersCount);
        response.setNumberOfWrongAnswers(wrongAnswersCount);

        // Save quiz results if the user logged in
        if (principal != null &&
            principal.getName() != null &&
            !principal.getName().isEmpty()) {
            // User logged in
            QuizResult quizResult = new QuizResult();
            quizResult.setQuizType(QuizType.TEST);
            quizResult.setCorrectAnswersCount(correctAnswersCount);
            quizResult.setWrongAnswersCount(wrongAnswersCount);

            quizResultService.saveQuizResult(quizResult, principal);
        }

        return response;
    }

    public QuestionPractice getRandomPracticeQuestion() {
        Question randomQuestion = quizRepository.findRandomGeneralQuestions(1).get(0);

        QuestionPractice questionPractice = new QuestionPractice();
        questionPractice.setQuestionId(randomQuestion.getId());
        questionPractice.setQuestionText(randomQuestion.getQuestionText());
        questionPractice.setImagePath(randomQuestion.getImagePath());


        List<AnswerPractice> answersPractice = randomQuestion.getAnswers().stream()
                .map(answer -> new AnswerPractice(
                        answer.getId(),
                        answer.getAnswerText())
                )
                .collect(Collectors.toList());

        Collections.shuffle(answersPractice);
        questionPractice.setAnswers(answersPractice);

        questionPractice.setCorrectAnswerId(
                randomQuestion.getAnswers().stream()
                        .filter(Answer::isCorrect)
                        .map(Answer::getId)
                        .findFirst()
                        .orElse(null)
        );

        return questionPractice;
    }
}
