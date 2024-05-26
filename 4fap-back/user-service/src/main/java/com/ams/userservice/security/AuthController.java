package com.ams.userservice.security;


import com.ams.userservice.dto.UserDto;
import com.ams.userservice.entities.Role;
import com.ams.userservice.entities.User;
import com.ams.userservice.exceptions.ResourceNotFoundException;
import com.ams.userservice.repositories.RoleRepository;
import com.ams.userservice.repositories.UserRepository;
import com.ams.userservice.security.jwt.JwtUtils;
import com.ams.userservice.security.request.AuthResponse;
import com.ams.userservice.security.request.LoginRequest;
import com.ams.userservice.security.request.SignupRequest;
import com.ams.userservice.security.request.VerifyCodeRequest;
import com.ams.userservice.security.response.MessageResponse;
import com.ams.userservice.services.EmailVerificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.*;


@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    private TokenProvider tokenProvider;

    @Autowired
    HttpServletRequest request;

    @Autowired
    private EmailVerificationService emailVerificationService;

    @Operation(summary = "authenticate a user")
    @ApiResponse(responseCode = "200", description = "User logged in successfully",
            content = {@Content(mediaType = "application/json",
                    schema = @Schema(implementation = AuthResponse.class))})
    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) throws MessagingException {

        userRepository.findByUsername(loginRequest.getUsername()).orElseThrow(() -> new RuntimeException("Enter a valid username or password."));

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )
        );

        Optional<User> loggedIn = userRepository.findByUsername(loginRequest.getUsername());


        emailVerificationService.sendVerificationCode(loggedIn.get().getEmail());

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String token = tokenProvider.createToken(authentication);

        return ResponseEntity.ok().body(new AuthResponse(token, loggedIn));

    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyCode(@RequestBody VerifyCodeRequest verifyCodeRequest) {
        String userEmail = verifyCodeRequest.getEmail();
        String userEnteredCode = verifyCodeRequest.getCode();

        if (emailVerificationService.verifyCode(userEmail, userEnteredCode)) {
            return ResponseEntity.ok().body(new MessageResponse("User verified successfully."));

        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponse("Invalid verification code."));
        }
    }


    @Operation(summary = "Register a new user")
    @ApiResponse(responseCode = "200", description = "User registration completed successfully !!",
            content = {@Content(mediaType = "application/json",
                    schema = @Schema(implementation = AuthResponse.class))})
    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) throws BadRequestException {

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            throw new BadRequestException("Email address already in use.");
        }
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            throw new BadRequestException("Username already in use.");
        }


        User user = User.builder()
                .username(signUpRequest.getUsername())
                .email(signUpRequest.getEmail())
                .password(encoder.encode(signUpRequest.getPassword()))
                .firstName(signUpRequest.getFirstName())
                .lastName(signUpRequest.getLastName())
                .build();

        Set<String> strRoles = signUpRequest.getRole();
        Set<Role> roles = new HashSet<>();

        if (strRoles == null) {
            throw new BadRequestException("Role is not found.");
        } else {
            strRoles.forEach(role -> {
                Role adminRole = roleRepository.findByName(role)
                        .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                roles.add(adminRole);
            });
        }

        user.setRoles(roles);

        User result = userRepository.save(user);

        URI location = ServletUriComponentsBuilder
                .fromCurrentContextPath().path("/user/me")
                .buildAndExpand(result.getId()).toUri();

        String appUrl = request.getContextPath();

        HashMap<Object, Object> objectObjectHashMap = new HashMap<>();
        objectObjectHashMap.put("Message", "User registered successfully!");
        objectObjectHashMap.put("UserId", result.getId());


        return ResponseEntity.created(location)
                .body(objectObjectHashMap);
    }

  /*@PostMapping("/signout")
  public ResponseEntity<?> logoutUser() {
    ResponseCookie cookie = jwtUtils.getCleanJwtCookie();
    return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie.toString())
            .body(new MessageResponse("You've been signed out!"));
  }*/

    @Operation(summary = "Get the current user")
    @ApiResponse(responseCode = "200", description = "User retrieved successfully",
            content = {@Content(mediaType = "application/json",
                    schema = @Schema(implementation = User.class))})
    @GetMapping("/user/me")
    public User getCurrentUser(@CurrentUser UserPrincipal userPrincipal) {
        return userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userPrincipal.getId()));
    }

}
