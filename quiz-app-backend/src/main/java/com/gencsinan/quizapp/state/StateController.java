package com.gencsinan.quizapp.state;

import com.gencsinan.quizapp.dtos.state.response.StateDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
public class StateController {
    @GetMapping("/states")
    public ResponseEntity<List<StateDTO>> getAllStates(){
        List<StateDTO> states = Arrays.stream(State.values())
                .map(state -> new StateDTO(state.name(), state.getName()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(states);
    }
}
