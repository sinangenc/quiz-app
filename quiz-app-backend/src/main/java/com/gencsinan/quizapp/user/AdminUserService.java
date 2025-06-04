package com.gencsinan.quizapp.user;

import com.gencsinan.quizapp.dtos.users.request.AdminUserCreateDTO;
import com.gencsinan.quizapp.dtos.users.request.AdminUserUpdateDTO;
import com.gencsinan.quizapp.dtos.users.response.UserRoleDTO;
import com.gencsinan.quizapp.exceptions.PasswordException;
import com.gencsinan.quizapp.exceptions.UserAlreadyExistsException;
import com.gencsinan.quizapp.exceptions.UserNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AdminUserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public AdminUserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Page<User> getAllUsers(Pageable pageable){
        Page<User> users = userRepository.findAll(
                PageRequest.of(
                        pageable.getPageNumber(),
                        pageable.getPageSize(),
                        pageable.getSortOr(Sort.by(Sort.Direction.ASC, "id"))
                ));

        return users;
    }

    public void setActiveStatus(Long id, boolean status) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
        user.setActive(status);
        userRepository.save(user);
    }

    public List<UserRoleDTO> getAllRoles() {
        return Arrays.stream(UserRole.values())
                .map(role -> new UserRoleDTO(role.name(), role.getDescription()))
                .collect(Collectors.toList());
    }

    public User createUser(AdminUserCreateDTO userCreateUpdateDTO) {
        // 1. Check password
        if (userCreateUpdateDTO.getPassword().length() < 6) {
            throw new PasswordException("Password must be at least 6 characters.");
        }
        if (!userCreateUpdateDTO.getPassword().equals(userCreateUpdateDTO.getConfirmPassword())) {
            throw new PasswordException("Passwords do not match.");
        }

        // 2. Check if email already exists
        if (userRepository.existsByEmail(userCreateUpdateDTO.getEmail())) {
            throw new UserAlreadyExistsException("This e-mail is already in use.");
        }

        // 3. Create new user
        User user = new User();
        user.setName(userCreateUpdateDTO.getName());
        user.setEmail(userCreateUpdateDTO.getEmail());
        user.setPassword(passwordEncoder.encode(userCreateUpdateDTO.getPassword()));
        user.setRole(userCreateUpdateDTO.getRole());
        user.setActive(userCreateUpdateDTO.isActive());

        // 4. Return  new user
        return userRepository.save(user);
    }

    public boolean deleteUserById(Long userId) {
        Optional<User> optionalUser = userRepository.findById(userId);

        if (optionalUser.isPresent()) {
            userRepository.deleteById(userId);
            return true;
        }

        return false;
    }

    public boolean updateUser(Long userId, AdminUserUpdateDTO request) {
        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isEmpty()) {
            return false;
        }

        User user = optionalUser.get();

        // Control email, if it was changed
        if (!user.getEmail().equals(request.getEmail()) &&
                userRepository.existsByEmail(request.getEmail())) {
            throw new UserAlreadyExistsException("This e-mail is already in use.");
        }

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setActive(request.isActive());
        user.setRole(request.getRole());
        userRepository.save(user);

        return true;
    }

    public Optional<User> getUserById(Long userId) {
        return userRepository.findById(userId);
    }

    public boolean updateUserPassword(Long userId, String password, String confirmPassword) {
        if (password == null || confirmPassword == null || password.length() < 6 ) {
            throw new PasswordException("Password must be at least 6 characters.");
        }

        if (!password.equals(confirmPassword)) {
            throw new PasswordException("Passwords do not match.");
        }


        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isEmpty()) {
            return false;
        }

        User user = optionalUser.get();
        user.setPassword(passwordEncoder.encode(password));
        userRepository.save(user);
        return true;
    }
}
