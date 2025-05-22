package com.gencsinan.quizapp.user;

import com.gencsinan.quizapp.dtos.users.request.UserPasswordChangeRequestDTO;
import com.gencsinan.quizapp.dtos.users.request.UserProfileUpdateRequestDTO;
import com.gencsinan.quizapp.dtos.users.response.UserInfoResponse;
import com.gencsinan.quizapp.exceptions.PasswordException;
import com.gencsinan.quizapp.exceptions.UserNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserInfoResponse getUserInfo(String email) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new UserNotFoundException("User not found");
        }
        return new UserInfoResponse(user.getId(), user.getName(), user.getEmail());
    }

    public void deleteUserByEmail(String email) {
        if (!userRepository.existsByEmail(email)) {
            throw new UserNotFoundException("User not found");
        }
        userRepository.deleteByEmail(email);
    }

    public void updateUserProfile(String email, UserProfileUpdateRequestDTO updatedUserProfile) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new UserNotFoundException("User not found");
        }

        user.setName(updatedUserProfile.getName());
        userRepository.save(user);
    }

    public void changePassword(String email, UserPasswordChangeRequestDTO passwordChangeRequest) {
        // Check password length
        if (passwordChangeRequest.getNewPassword().length() < 6) {
            throw new PasswordException("Password must be at least 6 characters.");
        }

        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        if (!passwordEncoder.matches(passwordChangeRequest.getOldPassword(), user.getPassword())) {
            throw new PasswordException("Old Password is incorrect.");
        }

        user.setPassword(passwordEncoder.encode(passwordChangeRequest.getNewPassword()));
        userRepository.save(user);
    }
}
