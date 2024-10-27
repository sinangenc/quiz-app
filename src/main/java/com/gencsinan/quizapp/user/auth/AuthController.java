package com.gencsinan.quizapp.user.auth;

import com.gencsinan.quizapp.dtos.auth.login.request.LoginRequest;
import com.gencsinan.quizapp.dtos.auth.login.response.LoginResponse;
import com.gencsinan.quizapp.dtos.auth.register.request.RegisterRequest;
import com.gencsinan.quizapp.exceptions.PasswordException;
import com.gencsinan.quizapp.exceptions.UserAlreadyExistsException;
import com.gencsinan.quizapp.user.User;
import com.gencsinan.quizapp.user.UserRepository;
import com.gencsinan.quizapp.user.UserRole;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriComponentsBuilder;


import java.net.URI;
import java.time.Instant;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final JwtEncoder jwtEncoder;
    private final AuthenticationManager authenticationManager;
    private final long jwtExpirationInSeconds;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public AuthController(JwtEncoder jwtEncoder,
                          AuthenticationManager authenticationManager,
                          @Value("${jwt.expiry}") long jwtExpirationInSeconds,
                          UserRepository userRepository,
                          PasswordEncoder passwordEncoder) {
        this.jwtEncoder = jwtEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtExpirationInSeconds = jwtExpirationInSeconds;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
        // Check user credentials
        var authenticatedUser = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );


        // Create the token
        Instant now = Instant.now();

        String scope = authenticatedUser.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(" "));

        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("self")
                .issuedAt(now)
                .expiresAt(now.plusSeconds(jwtExpirationInSeconds))
                .subject(authenticatedUser.getName())
                .claim("roles", scope)
                .build();

        String token = jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();

        LoginResponse response = new LoginResponse(token);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<Void> register(@RequestBody RegisterRequest registerRequest) {
        // Check if email already exists
        boolean isEmailAlreadyUsed = userRepository.existsByEmail(registerRequest.getEmail());
        if (isEmailAlreadyUsed) {
            throw new UserAlreadyExistsException("This e-mail is already in use.");
        }

        // Check password
        if (registerRequest.getPassword().length() < 6) {
            throw new PasswordException("Password must be at least 6 characters.");
        }

        if (!registerRequest.getPassword().equals(registerRequest.getConfirmPassword())) {
            throw new PasswordException("Passwords do not match.");
        }

        // Create new user
        User newUser = new User();
        newUser.setName(registerRequest.getName());
        newUser.setEmail(registerRequest.getEmail());
        newUser.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        newUser.setActive(true);
        newUser.setRole(UserRole.USER);
        userRepository.save(newUser);


        // Return response
        URI locationOfNewUser = UriComponentsBuilder.fromPath("/users/{id}").buildAndExpand(newUser.getId()).toUri();

        return ResponseEntity.created(locationOfNewUser).build();
    }
}