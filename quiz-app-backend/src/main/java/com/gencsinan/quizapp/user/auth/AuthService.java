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
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.time.Instant;
import java.util.stream.Collectors;

@Service
public class AuthService {
    private final JwtEncoder jwtEncoder;
    private final AuthenticationManager authenticationManager;
    private final long jwtExpirationInSeconds;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public AuthService(JwtEncoder jwtEncoder,
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

    public LoginResponse login(LoginRequest loginRequest) {
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

        return new LoginResponse(token);
    }

    public URI register(RegisterRequest request) {
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new UserAlreadyExistsException("This e-mail is already in use.");
        }

        // Check password
        if (request.getPassword().length() < 6) {
            throw new PasswordException("Password must be at least 6 characters.");
        }

        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new PasswordException("Passwords do not match.");
        }

        // Create new user
        User newUser = new User();
        newUser.setName(request.getName());
        newUser.setEmail(request.getEmail());
        newUser.setPassword(passwordEncoder.encode(request.getPassword()));
        newUser.setActive(true);
        newUser.setRole(UserRole.USER);
        userRepository.save(newUser);

        // Return uri of new user
        return UriComponentsBuilder.fromPath("/users/{id}")
                .buildAndExpand(newUser.getId())
                .toUri();
    }
}
