package com.gencsinan.quizapp.question;

import com.gencsinan.quizapp.answer.Answer;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.*;

import java.net.URI;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class QuestionControllerIntegrationTests {

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    public void shouldReturnAnExistingQuestion() {
        ResponseEntity<Question> response = restTemplate
                .getForEntity("/admin/questions/4", Question.class);

        // Response code
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);

        // Question Text
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getQuestionText())
                .isEqualTo("Welches Recht gehört zu den Grundrechten in Deutschland?");

        // Answers
        List<Answer> answers = response.getBody().getAnswers();
        assertThat(answers.size()).isEqualTo(4);
    }

    @Test
    public void shouldNotReturnAQuestionWithUnknownId() {
        ResponseEntity<Question> response = restTemplate
                .getForEntity("/admin/questions/99", Question.class);

        // Response code
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);

    }

    @Test
    public void shouldSaveNewQuestion() {
        Question question = new Question();
        question.setQuestionText("Wie heißt die deutsche Verfassung?");
        question.setAnswers(List.of(
                new Answer("Volksgesetz", false),
                new Answer("Bundesgesetz", false),
                new Answer("Deutsches Gesetz", false),
                new Answer("Grundgesetz", true)
        ));

        ResponseEntity<Void> response = restTemplate.postForEntity("/admin/questions", question, Void.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);

        URI locationOfNewQuestion = response.getHeaders().getLocation();
        ResponseEntity<Question> getResponse = restTemplate.getForEntity(locationOfNewQuestion, Question.class);

        assertThat(getResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(getResponse.getBody().getQuestionText())
                .isEqualTo("Wie heißt die deutsche Verfassung?");
        assertThat(getResponse.getBody().getAnswers().size()).isEqualTo(4);
    }

    @Test
    public void shouldUpdateAnExistingQuestion(){
        Question question = new Question();
        question.setQuestionText("Deutschland ist ein Rechtsstaat. Was ist damit gemeint?");
        question.setAnswers(List.of(
                new Answer("Alle Einwohner / Einwohnerinnen und der Staat müssen sich an die Gesetze halten.", true),
                new Answer("Der Staat muss sich nicht an die Gesetze halten.", false),
                new Answer("Deutsches Gesetz", false),
                new Answer("Grundgesetz", false)
        ));

        HttpEntity<Question> request = new HttpEntity<>(question);

        ResponseEntity<Void> response = restTemplate
                .exchange("/admin/questions/4", HttpMethod.PUT, request, Void.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);

        ResponseEntity<Question> getResponse = restTemplate.getForEntity("/admin/questions/4", Question.class);
        assertThat(getResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(getResponse.getBody().getQuestionText()).isEqualTo("Deutschland ist ein Rechtsstaat. Was ist damit gemeint?");
        assertThat(getResponse.getBody().getAnswers().size()).isEqualTo(4);
    }

    @Test
    public void shouldNotUpdateAQuestionThatDoesNotExist(){
        Question question = new Question();
        question.setId(999L);
        question.setQuestionText("Wie heißt die deutsche Verfassung?");
        question.setAnswers(List.of(
                new Answer("Volksgesetz", false),
                new Answer("Bundesgesetz", false),
                new Answer("Deutsches Gesetz", false),
                new Answer("Grundgesetz", false)
        ));

        HttpEntity<Question> request = new HttpEntity<>(question);

        ResponseEntity<Void> response = restTemplate
                .exchange("/admin/questions/999", HttpMethod.PUT, request, Void.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    public void shouldDeleteAnExistingQuestion() {
        ResponseEntity<Void> response = restTemplate
                .exchange("/admin/questions/1", HttpMethod.DELETE, null, Void.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);

        ResponseEntity<Question> getResponse = restTemplate
                .getForEntity("/admin/questions/1", Question.class);

        assertThat(getResponse.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    public void shouldNotDeleteAQuestionThatDoesNotExist() {
        ResponseEntity<Void> response = restTemplate
                .exchange("/admin/questions/99", HttpMethod.DELETE, null, Void.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }
}
