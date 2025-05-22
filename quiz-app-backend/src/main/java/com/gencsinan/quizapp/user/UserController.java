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
    private final UserService userService;
    private final UserRepository userRepository;

    @Autowired
    public UserController(UserService userService, UserRepository userRepository) {
        this.userService = userService;
        this.userRepository = userRepository;
    }

    @GetMapping("/me")
    public ResponseEntity<UserInfoResponse> getAuthenticatedUser(Principal principal) {
        UserInfoResponse response = userService.getUserInfo(principal.getName());
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/me")
    public ResponseEntity<Void> deleteAuthenticatedUser(Principal principal) {
        userService.deleteUserByEmail(principal.getName());
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/me")
    public ResponseEntity<Void> updateAuthenticatedUser(Principal principal, @RequestBody UserProfileUpdateRequestDTO updatedUserProfile){
        userService.updateUserProfile(principal.getName(), updatedUserProfile);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/me/password")
    public ResponseEntity<Void> updatePasswordOfAuthenticatedUser(Principal principal, @RequestBody UserPasswordChangeRequestDTO passwordChangeRequest){
        userService.changePassword(principal.getName(), passwordChangeRequest);
        return ResponseEntity.noContent().build();
    }
}