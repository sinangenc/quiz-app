package com.gencsinan.quizapp.user;

import com.gencsinan.quizapp.dtos.users.response.UserInfoResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/users")
public class UserController {
    private final UserRepository userRepository;

    @Autowired
    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/me")
    public ResponseEntity<UserInfoResponse> authenticatedUser(Principal principal) {
        String email = principal.getName();
        User user = userRepository.findByEmail(email);

        UserInfoResponse response = new UserInfoResponse(user.getId(), user.getName(), user.getEmail());
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/me")
    public ResponseEntity<Void> deleteAuthenticatedUser(Principal principal) {
        String email = principal.getName();
        if (userRepository.existsByEmail(email)) {
            userRepository.deleteByEmail(email);
            return ResponseEntity.noContent().build();
        }
        else {
            return ResponseEntity.notFound().build();
        }
    }

}