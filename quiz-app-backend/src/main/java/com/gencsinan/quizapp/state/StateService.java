package com.gencsinan.quizapp.state;

import com.gencsinan.quizapp.dtos.state.response.StateDTO;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class StateService {
    public List<StateDTO> getAllStates() {
        return Arrays.stream(State.values())
                .map(state -> new StateDTO(state.name(), state.getName()))
                .collect(Collectors.toList());
    }
}
