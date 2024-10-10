package com.gencsinan.quizapp.state;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.assertj.core.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class StateControllerIntegrationTests {
    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    public void shouldReturnAllStates() {
        ResponseEntity<String> states = restTemplate.getForEntity("/states", String.class);

        assertThat(states.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(states.getBody()).isNotBlank();
    }
}