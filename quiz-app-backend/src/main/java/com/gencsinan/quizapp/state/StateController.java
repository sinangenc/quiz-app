package com.gencsinan.quizapp.state;

import com.gencsinan.quizapp.dtos.state.response.StateDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/states")
public class StateController {
    private final StateService stateService;

    public StateController(StateService stateService) {
        this.stateService = stateService;
    }

    @GetMapping
    public ResponseEntity<List<StateDTO>> getAllStates() {
        List<StateDTO> states = stateService.getAllStates();
        return ResponseEntity.ok(states);
    }
}
