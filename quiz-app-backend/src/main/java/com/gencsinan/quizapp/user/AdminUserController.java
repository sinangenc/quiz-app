package com.gencsinan.quizapp.user;

import com.gencsinan.quizapp.dtos.users.request.AdminUserCreateDTO;
import com.gencsinan.quizapp.dtos.users.request.AdminUserUpdateDTO;
import com.gencsinan.quizapp.dtos.users.response.UserRoleDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/admin/users")
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {
    private final AdminUserService adminUserService;

    @Autowired
    public AdminUserController(AdminUserService adminUserService) {
        this.adminUserService = adminUserService;
    }


    @GetMapping
    public ResponseEntity<Page<User>> getAllUsers(Pageable pageable) {
        Page<User> users = adminUserService.getAllUsers(pageable);
        return ResponseEntity.ok(users);
    }


    @GetMapping("/{userId}")
    public ResponseEntity<User> getUserById(@PathVariable Long userId) {
        Optional<User> user = adminUserService.getUserById(userId);

        return user
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }


    @PostMapping
    public ResponseEntity<Void> createUser(@RequestBody AdminUserCreateDTO userCreateUpdateDTO,
                                        UriComponentsBuilder ucb) {

        User newUser = adminUserService.createUser(userCreateUpdateDTO);

        URI location = ucb
                .path("/admin/users/{id}")
                .buildAndExpand(newUser.getId())
                .toUri();

        return ResponseEntity.created(location).build();
    }

    @PutMapping("/{userId}")
    public ResponseEntity<?> updateUser(@PathVariable Long userId,
                                        @RequestBody AdminUserUpdateDTO request) {
        boolean updated = adminUserService.updateUser(userId, request);

        if (updated) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.notFound().build();
    }


    @PutMapping("/{userId}/activate")
    public ResponseEntity<Void> activateUser(@PathVariable Long userId) {
        adminUserService.setActiveStatus(userId, true);
        return ResponseEntity.noContent().build();
    }


    @PutMapping("/{userId}/deactivate")
    public ResponseEntity<Void> deactivateUser(@PathVariable Long userId) {
        adminUserService.setActiveStatus(userId, false);
        return ResponseEntity.noContent().build();
    }


    @PutMapping("/{userId}/change-password")
    public ResponseEntity<Void> updateUserPassword(@PathVariable Long userId, @RequestBody AdminUserCreateDTO request) {
        boolean updated = adminUserService.updateUserPassword(userId, request.getPassword(), request.getConfirmPassword());
        if (updated) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.notFound().build();
    }


    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteUserById(@PathVariable Long userId) {
        boolean deleted = adminUserService.deleteUserById(userId);

        if (deleted) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.notFound().build();
    }


    @GetMapping("/roles")
    public ResponseEntity<List<UserRoleDTO>> getAllStates() {
        List<UserRoleDTO> roles = adminUserService.getAllRoles();
        return ResponseEntity.ok(roles);
    }
}
