package com.gencsinan.quizapp.user;

import com.gencsinan.quizapp.dtos.users.request.UserPasswordChangeRequestDTO;
import com.gencsinan.quizapp.dtos.users.request.UserProfileUpdateRequestDTO;
import com.gencsinan.quizapp.dtos.users.response.UserInfoResponse;
import com.gencsinan.quizapp.exceptions.PasswordException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/users")
public class UserController {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
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

    @PutMapping("/me")
    public ResponseEntity<Void> updateAuthenticatedUser(Principal principal, @RequestBody UserProfileUpdateRequestDTO updatedUserProfile){
        String email = principal.getName();
        User user = userRepository.findByEmail(email);

        if (user != null) {
            user.setName(updatedUserProfile.getName());
            userRepository.save(user);

            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.notFound().build();
    }

    @PutMapping("/me/password")
    public ResponseEntity<Void> updatePasswordOfAuthenticatedUser(Principal principal, @RequestBody UserPasswordChangeRequestDTO passwordChangeRequest){

        // Check password
        if (passwordChangeRequest.getNewPassword().length() < 6) {
            throw new PasswordException("Password must be at least 6 characters.");
        }

        String email = principal.getName();
        User user = userRepository.findByEmail(email);

        if (user != null) {
            if (!passwordEncoder.matches(passwordChangeRequest.getOldPassword(), user.getPassword())) {
                throw new PasswordException("Old Password is incorrect.");
            }

            user.setPassword(passwordEncoder.encode(passwordChangeRequest.getNewPassword()));
            userRepository.save(user);

            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.notFound().build();
    }
}