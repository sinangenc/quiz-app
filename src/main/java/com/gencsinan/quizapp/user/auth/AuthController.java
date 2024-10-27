package com.gencsinan.quizapp.user.auth;

import com.gencsinan.quizapp.dtos.auth.request.AuthRequest;
import com.gencsinan.quizapp.dtos.auth.response.AuthResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;


import java.time.Instant;
import java.util.stream.Collectors;

@RestController
public class AuthController {

    private final JwtEncoder jwtEncoder;
    private final AuthenticationManager authenticationManager;
    private final long jwtExpirationInSeconds;

    @Autowired
    public AuthController(JwtEncoder jwtEncoder,
                          AuthenticationManager authenticationManager,
                          @Value("${jwt.expiry}") long jwtExpirationInSeconds) {
        this.jwtEncoder = jwtEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtExpirationInSeconds = jwtExpirationInSeconds;
    }

    @PostMapping("/auth")
    public ResponseEntity<AuthResponse> auth(@RequestBody AuthRequest authRequest) {
        // Check user credentials
        var authenticatedUser = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        authRequest.getEmail(),
                        authRequest.getPassword()
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

        AuthResponse response = new AuthResponse(token);
        return ResponseEntity.ok(response);
    }

}