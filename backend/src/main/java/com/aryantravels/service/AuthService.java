package com.aryantravels.service;

import com.aryantravels.dto.AuthResponse;
import com.aryantravels.dto.LoginRequest;
import com.aryantravels.dto.SignupRequest;
import com.aryantravels.model.User;
import com.aryantravels.repository.UserRepository;
import com.aryantravels.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public AuthResponse signup(SignupRequest signupRequest) {
        try {
            // Check if user already exists
            if (userRepository.existsByEmail(signupRequest.getEmail())) {
                return new AuthResponse("Error: Email is already in use!");
            }

            // Create new user
            User user = new User(
                signupRequest.getName(),
                signupRequest.getEmail(),
                passwordEncoder.encode(signupRequest.getPassword())
            );

            // Set default role
            user.setRole("USER");

            // Save user to database
            User savedUser = userRepository.save(user);

            // Generate JWT token
            String jwt = jwtUtil.generateToken(
                savedUser.getEmail(),
                savedUser.getId(),
                savedUser.getRole()
            );

            return new AuthResponse(
                jwt,
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getRole()
            );

        } catch (Exception e) {
            return new AuthResponse("Error: Failed to register user - " + e.getMessage());
        }
    }

    public AuthResponse login(LoginRequest loginRequest) {
        try {
            // Find user by email
            Optional<User> userOptional = userRepository.findByEmailAndEnabled(
                loginRequest.getEmail(), 
                true
            );

            if (userOptional.isEmpty()) {
                return new AuthResponse("Error: Invalid email or password!");
            }

            User user = userOptional.get();

            // Check password
            if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
                return new AuthResponse("Error: Invalid email or password!");
            }

            // Generate JWT token
            String jwt = jwtUtil.generateToken(
                user.getEmail(),
                user.getId(),
                user.getRole()
            );

            return new AuthResponse(
                jwt,
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole()
            );

        } catch (Exception e) {
            return new AuthResponse("Error: Login failed - " + e.getMessage());
        }
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    public User getUserById(String id) {
        return userRepository.findById(id).orElse(null);
    }
}
